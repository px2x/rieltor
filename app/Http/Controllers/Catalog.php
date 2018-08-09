<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\Developer;
use App\District;
use App\Complex;
use App\City;
use App\Object;
use App\Ads;

class Catalog extends Controller
{

    protected function _getCount($rent)
    {

        if ( $rent === 0 )
        {
            $counters = session('counters', false);
        }
        else
        {
            $counters = session('counters_rent', false);
        }
        if ( empty($counters) )
        {
            $result = Ads::select(DB::raw('COUNT(id) cnt'), 'type')
                    ->where('rent', $rent)
                    ->where('status', 'publish')
                    ->groupby('type')
                    ->get()
                    ->toArray();
            $counters = array();
            foreach ( $result as $r )
            {
                $counters[$r['type']] = $r['cnt'];
            }
            $counters['rent'] = Ads::where('rent', 1)->count();
            if ( $rent === 0 )
            {
                session(array('counters' => $counters));
            }
            else
            {
                session(array('counters_rent' => $counters));
            }
        }
        return $counters;
    }
    
    protected function _getTitle($filter) {
        $arTypeTitle = array(
            1 => 'Квартиры',
            2 => 'Дома',
            3 => 'Участки',
            4 => 'Коммерческая недвижимость',
            5 => 'Гаражи',
        );
        $arTypeTitleRent = array(
            1 => 'Аренда квартир',
            2 => 'Аренда домов',
            3 => 'Аренда участков',
            4 => 'Аренда коммерческой недвижимости',
            5 => 'Аренда гаражей',
        );
        $arSubTypeTitle = array(
            1 => 'Комнаты',
            2 => 'Гостинки',
        );
        $arSubTypeTitleRent = array(
            1 => 'Аренда комнат',
            2 => 'Анерда гостинкок',
        );
        if(!isset($filter['type']) || !isset($arTypeTitle[$filter['type']])) {
            return $arTypeTitle[1];
        }
        
        $isRent = !empty($filter['rent']);
        if(!empty($filter['subtype']) && isset($arSubTypeTitle[$filter['subtype']])) {
            return $isRent ? $arSubTypeTitleRent[$filter['subtype']] : $arSubTypeTitle[$filter['subtype']];
        }
        
        return $isRent ? $arTypeTitleRent[$filter['type']] : $arTypeTitle[$filter['type']];
    }

    public function map(Request $request)
    {
        $filter = $request->all();

        $res = $this->_getAds($filter, 3);

        $city   = $res['city'];
        $result = $res['res'];
        $query  = $res['query'];

        $distM = '';
        $distO = '';
        if ( isset($filter['district_m']) )
        {
            $distM = $filter['district_m'];
        }

        if ( isset($filter['district_o']) )
        {
            $distO = $filter['district_o'];
        }

//        echo '<pre>';
//        var_dump(City::select('id', 'name')->get()->toArray());
//        die;

        return view('catalog-map')->with(array(
                    'counters'      => $this->_getCount(0),
                    'counters_rent' => $this->_getCount(1),
                    'districts_m'   => $distM,
                    'districts_o'   => $distO,
                    'developers'    => Developer::select('*')->get()->toArray(),
                    'complexes'     => Complex::select('*')->get()->toArray(),
                    'city_id'       => $city,
                    'search'        => $result['data'],
                    'from'          => $result['from'],
                    'to'            => $result['to'],
                    'material'      => $res['material'],
                    'total'         => $result['total'],
                    'title'         => $this->_getTitle($filter),
                    'cities'        => City::select('id', 'name')->get()->toArray(),
                    'isCatalog'     => true
        ));
    }

    protected function _getAds($filter, $paginate)
    {
        $query = Ads::select('*')->where('status', 'publish');

        if ( isset($filter['type']) && !empty($filter['type']) )
        {
            if ( isset($filter['rent']) && $filter['rent'] == 1 )
            {
                $query->where('rent', 1);
            }
            $type = (int) $filter['type'];

            if ( !empty($type) && $type < 10 )
            {
                $query->where('type', $type);
            }
            
            $arFilterMap = array(
                'priceT' => array('price','<='),
                'priceF' => array('price','>='),
                'foP1' => array('sq1','>='),
                'toP1' => array('sq1','<='),
                'flP1' => array('sq2','>='),
                'tlP1' => array('sq2','<='),
                'fkP1' => array('sq3','>='),
                'tkP1' => array('sq3','<='),
                'material' => array('material', '='),
                'subtype' => array('subtype', '='),
                'devel' => array('developer_id', '='),
                'complex' => array('complex_id', '='),
                'condition' => array('condition', '>='),
                'floorTF' => array('floor_t', '>='),
                'floorTT' => array('floor_t', '<='),
                'floorF' => array('floor', '>='),
                'floorT' => array('floor', '<='),
            );
            
            foreach($filter as $key => $value) {
                if(!isset($arFilterMap[$key]) || !is_numeric($value)) {
                    if(!in_array($key, array('dateFrom', 'dateTo', 'street'))) {
                        unset($_GET[$key]);
                    }
                    continue;
                }
                $map = $arFilterMap[$key];
                $query->where($map[0], $map[1], isset($map[2]) ? $map[2] * $value : $value);
            }
            
            if(isset($filter['dateFrom'])) {
                if(!empty($filter['dateFrom']) && validateDate($filter['dateFrom'])){
                    $query->where('published_at', '>=', date('Y-m-d', strtotime($filter['dateFrom'])));
                } else {
                    unset($_GET['dateFrom']);
                }
            }
            
            if(isset($filter['dateTo'])) {
                if(!empty($filter['dateTo']) && validateDate($filter['dateTo'])){
                    $query->where('published_at', '<=', date('Y-m-d', strtotime($filter['dateTo'])))->whereNotNull('published_at');
                } else {
                    unset($_GET['dateTo']);
                }
            }
            
            if(isset($filter['street'])) {
                $street = addslashes($filter['street']);
                $street = trim(htmlspecialchars($street));
                if(!empty($street)){
                    $query->where('address', 'LIKE', '%' . $street . '%');
                } else {
                    unset($_GET['street']);
                }
            }
            
            if ( $type === 1 ) //check rooms
            {
                $rooms = array();
                for ( $i = 1; $i <= 5; $i++ )
                {
                    if ( isset($filter['rooms' . $i]) )
                    {
                        $rooms[] = $i;
                    }
                }
                $query->where(function($q) use($rooms) {
                    foreach ( $rooms as $r )
                    {
                        $q->orWhere('rooms', ($r == 5 ? '>=' : '='), $r);
                    }
                });
            }
        }

        $city = '';

        if (isset($filter['city_id']) && !empty($filter['city_id']) )
        {
            $city = (int) $filter['city_id'];

            if ( !empty($city) )
            {
                $query->where('city_id', $city);
                if (!empty($filter['district_m']) )
                {
                    $dFilter = array();
                    foreach ($filter['district_m'] as $district) {
                        if(!is_numeric($district)) {
                            continue;
                        }
                        $dFilter[] = $district;
                    }
                    if(!empty($dFilter)) {
                        $query->whereIn('district_m', $dFilter);
                    }
                }

                if (!empty($filter['district_o']) )
                {
                    $dFilter = array();
                    foreach ($filter['district_o'] as $district_o) {
                        if(!is_numeric($district_o)) {
                            continue;
                        }
                        $dFilter[] = $district_o;
                    }
                    if(!empty($dFilter)) {
                        $query->whereIn('district_o', $dFilter);
                    }
                }
            }
        }

//        DB::enableQueryLog();
//        $result = $query->get()->toArray();
//        echo '<pre>';
//        print_r(DB::getQueryLog());
//        print_r($result);
//        die;

        if ( !empty($filter['orderBy']) && in_array($filter['orderBy'], array('price', 'condition')) )
        {
            $orderBy = $filter['orderBy'];
        }
        else
        {
            $orderBy = 'price';
        }

        $result = $query->orderBy($orderBy)->paginate($paginate)->toArray();
        $material = array(
            '1' => 'Кирпич',
            '2' => 'Панель',
            '3' => 'Кирпично-панельный',
        );

//        echo '<pre>';
//        var_dump($result);
//        die;
        return array('res' => $result, 'city' => $city, 'query' => $query, 'material' => $material);
    }

    public function table(Request $request)
    {
        $filter = $request->all();

        $res = $this->_getAds($filter, 5);

        $city   = $res['city'];
        $result = $res['res'];

        $distM = '';
        $distO = '';
        if ( isset($filter['district_m']) )
        {
            $distM = $filter['district_m'];
        }

        if ( isset($filter['district_o']) )
        {
            $distO = $filter['district_o'];
        }
        return view('catalog2')->with(array(
                    'counters'      => $this->_getCount(0),
                    'counters_rent' => $this->_getCount(1),
                    'districts_m'   => $distM,
                    'districts_o'   => $distO,
                    'developers'    => Developer::select('*')->get()->toArray(),
                    'complexes'     => Complex::select('*')->get()->toArray(),
                    'city_id'       => $city,
                    'search'        => $result['data'],
                    'from'          => $result['from'],
                    'to'            => $result['to'],
                    'material'      => $res['material'],
                    'total'         => $result['total'],
                    'title'         => $this->_getTitle($filter),
                    'cities'        => City::select('id', 'name')->get()->toArray(),
                    'isCatalog'     => true
        ));
    }

    public function index(Request $request)
    {
        $filter = $request->all();

        $res = $this->_getAds($filter, 15);

        $city   = $res['city'];
        $result = $res['res'];

        $distM = '';
        $distO = '';

        if ( isset($filter['district_m']) )
        {
            $distM = $filter['district_m'];
        }

        if ( isset($filter['district_o']) )
        {
            $distO = $filter['district_o'];
        }
        return view('catalog')->with(array(
                    'counters'      => $this->_getCount(0),
                    'counters_rent' => $this->_getCount(1),
                    'districts_m'   => $distM,
                    'districts_o'   => $distO,
                    'developers'    => Developer::select('*')->get()->toArray(),
                    'complexes'     => Complex::select('*')->get()->toArray(),
                    'city_id'       => $city,
                    'search'        => $result['data'],
                    'from'          => $result['from'],
                    'to'            => $result['to'],
                    'material'      => $res['material'],
                    'total'         => $result['total'],
                    'title'         => $this->_getTitle($filter),
                    'cities'        => City::select('id', 'name')->get()->toArray(),
                    'isCatalog'     => true
        ));
    }

    public function item($id)
    {
        $ad = Ads::find($id);
        
        if(empty($ad)) {
            $contents = view('404');
            return response($contents, 404);
        }
        
        $res = $ad->toArray();
        if ( isset($res['district_o']) && !empty($res['district_o']) )
        {
            $distO             = District::where('id', '=', $res['district_o'])->first();
            $res['district_o'] = !empty($distO) ? $distO->name : false;
        }

        if ( isset($res['district_m']) && !empty($res['district_m']) )
        {
            $distM             = District::where('id', '=', $res['district_m'])->first();
            $res['district_m'] = !empty($distM) ? $distM->name : false;
        }
        
        $material = array(
            1 => 'Кирпич',
            2 => 'Панель',
            3 => 'Кирпично-панельный',
        );
        
        $t = strtotime($res['published_at']);
        $res['created'] = date('d.m.Y', $t);

        if(isset($res['material']) && !empty($res['material']))
        {
            $res['material'] = $material[$res['material']];
        }
        $type = array(
            0 => 'Квартира', 1 =>'Квартира', 2 => 'Дом', 3 => 'Участок', 4 => 'Гараж', 5 => 'Коммерческая недвижимость'
        );
        if($res['type'] == 1 && $res['subtype'] == 1) {
            $res['type_name'] = 'Комната';
        }
        elseif($res['type'] == 1 && $res['subtype'] == 2) {
            $res['type_name'] = 'Гостинка';
        } 
        else {
            $res['type_name'] = $type[$res['type']];
        }
        
        $comPrice = 0;
        if (!empty($this->_settings['comission_price']))
        {
            $comPrice = $this->_settings['comission_price'];
        }
        
        if(Input::get('print') == 'Y') {
            return view('catalog-item-print')->with(array(
                'ads' => $res,
                'comission' => $comPrice
            ));
        }
        
        return view('catalog-item')->with(array(
            'ads' => $res,
            'photos' => $ad->photos()->get(),
            'object' => $ad->object()->first(),
            'comission' => $comPrice,
            'counters' => $this->_getCount(0)
        ));
    }

    public function cart()
    {
        return view('cart');
    }
    
    public function streets(Request $request) {
        $street = $request->get('street');
        $street = addslashes($street);
        $street = trim(htmlspecialchars($street));
        $response = array('success' => true, 'streets' => array());
        $code = 200;
        
        if( !empty($street) )
        {
            $streets = Object::select('street')
                    ->where('street', 'LIKE', '%' . $street . '%')
                    ->groupBy('street')
                    ->orderBy('street', 'ASC')
                    ->limit(10)
                    ->get();
            $response['streets'] = $streets->toArray();
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }

}

function validateDate($date, $format = 'd.m.Y')
{
    $d = \DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}