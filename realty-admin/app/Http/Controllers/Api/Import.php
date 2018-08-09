<?php namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Log;

use App\Ads;
use App\District;
use App\Object;
use App\City;

class Import extends Controller {

    public function importAdsToDatabase()
    {
        set_time_limit(0);
        $result = array(
            'status' =>false
        );
        $fname = Input::get('fileName', false);
        $check = Input::get('check', 'all');
        $readFile = file_get_contents(base_path() . '/public/uploads/xml/'.$fname);
        $xml = simplexml_load_string($readFile);
        $json = json_encode($xml);
        $array = json_decode($json,TRUE);
        $countSave = 0;
        $inarray = array(
            'ЗЖМ' => 'ЗЖМ',
            'Ленина' => 'Ленина',
            'Левенц.' => 'Левенцовка',
            'Нахич.' => 'Нахичевань',
            'Чкалов.' => 'Чкаловский',
            'Центр' => 'Центр',
            'Каменка' => 'Каменка',
            'В-вед' => 'Военвед',
            'Зоопарк' => 'Зоопарк',
            'Суворовский' => 'Суворовский',
            'СЖМ' => 'СЖМ',
            'Темерн.' => 'Темерник',
            'ЖДР' => 'ЖДР',
            'Сельм.' => 'Сельмаш',
            '2 Ордж.' => '2-й п. Орджоникидзе',
            'Аэроп.' => 'Аэропорт',
            'Алекс.' => 'Александровка',
            'Комс.пл.' => 'Комсомольская площадь',
            'Вертолетное поле' => 'Вертолетное поле',
            'Нариман.' => 'Нариманова',
            'Портов.' => 'Портовая',
            'Нов.пос.' => 'Новое поселение',
            'Платовский' => 'Платовский',
        );
        $districts = array(
            'ЗЖМ' => 'Советский',
            'Ленина' => 'Октябрьский',
            'Левенц.' => 'Советский',
            'Нахич.' => 'Пролетарский',
            'Чкалов.' => 'Первомайский',
            'Центр' => 'Кировский',
            'Каменка' => 'Октябрьский',
            'В-вед' => 'Октябрьский',
            'Зоопарк' => 'Октябрьский',
            'Суворовский' => 'Октябрьский',
            'СЖМ' => 'Ворошиловский',
            'Темерн.' => 'Первомайский',
            'ЖДР' => 'Железнодорожный',
            'Сельм.' => 'Первомайский',
            '2 Ордж.' => 'Первомайский',
            'Аэроп.' => 'Первомайский',
            'Алекс.' => 'Пролетарский',
            'Вертолетное поле' => 'Железнодорожный',
            'Комс.пл.' => 'Октябрьский',
            'Нариман.' => 'Ворошиловский',
            'Портов.' => 'Железнодорожный',
            'Нов.пос.' => 'Ленинский',
            'Платовский' => 'Первомайский',
        );
        $conditions = array('Евро' => 5, 'Отличное' => 5, 'Хорошее' => 4, 'Жилое' => 3, 'Треб. кап. ремонта' => 2, 'Треб. косм. ремонта' => 2, 'Без внутр. отделки' => 1);
        foreach ($array['offer'] as $data)
        {
            $old = Ads::where('leader_id', '=', $data['@attributes']['internal-id'])->first();
            if($check =='new' && $old)
            {
                continue;
            }
            else if ($old)
            {
                $saveAds = $old;
            }
            else
            {
                $saveAds = new Ads();
                $saveAds->id = $data['@attributes']['internal-id'];
                $saveAds->published_at = date('Y-m-d H:m:s');
                $saveAds->status = 'publish';
                
                //check if this id already exists (added by client + autoincrement)
                $checkAd = Ads::where('id', $saveAds->id)->count();
                if(!empty($checkAd)) {
                    Ads::where('id', $saveAds->id)->update(array('id' => rand(1,100000)));
                }
            }

            $saveAds->leader_id  = $data['@attributes']['internal-id'];
            $saveAds->rent  = $data['type'] == 'продажа' ? 0 : 1;
            $saveAds->description  = $data['description'];
            if(isset($data['built-year']))
            {
                $saveAds->year  = $data['built-year'];
            }
            if(isset($data['rooms']))
            {
                $saveAds->rooms  = $data['rooms'];
            }
            if(isset($data['floor']))
            {
                $saveAds->floor  = $data['floor'];
            }
            if(isset($data['floors-total']))
            {
                $saveAds->floor_t  = $data['floors-total'];
            }
            if(isset($data['living-space']))
            {
                $saveAds->sq2  = $data['living-space']['value'];
            }
            if(isset($data['kitchen-space']))
            {
                $saveAds->sq3  = $data['kitchen-space']['value'];
            }
            if(isset($data['rooms-type']))
            {
                $saveAds->phone = $data['rooms-type'];
            }
            if(isset($data['quality']))
            {
                if(isset($conditions[$data['quality']])) {
                    $saveAds->condition = $conditions[$data['quality']];
                } else {
                    Log::info('Unknown condition: ' . $data['quality']);
                }
            }
            elseif(!empty($data['renovation'])) {
                if(isset($conditions[$data['renovation']])) {
                    $saveAds->condition = $conditions[$data['renovation']];
                } else {
                    Log::info('Unknown renovation: ' . $data['renovation']);
                }
            }
            else {
                $saveAds->condition = 4;
            }
            if(isset($data['building-type']))
            {
                $material = $data['building-type'];
                if($material == 'Кирпичный') {
                    $saveAds->material = 1;
                } elseif ($material == 'Панельный') {
                    $saveAds->material = 2;
                }
            }
            $saveAds->type = 1;
            //TODO: rewrite when new categories appear
            if(isset($data['category']))
            {
                if($data['category'] == 'квартира')
                {
                    $saveAds->type  = 1;
                    
                    if(mb_stripos($saveAds->description, 'гостинка')){
                        $saveAds->subtype = 2;
                        if($saveAds->rooms > 1) {
                            $saveAds->name = 'Продается '.$saveAds->rooms.' комнатная гостинка';
                            if($saveAds->rent == 1)
                            {
                                $saveAds->name = 'Сдается '.$saveAds->rooms.' комнатная гостинка';
                            }
                        } 
                        else {
                            $saveAds->name = 'Продается гостинка';
                            if($saveAds->rent == 1)
                            {
                                $saveAds->name = 'Сдается гостинка';
                            }
                        }
                    } else {
                        $saveAds->name = 'Продается '.$saveAds->rooms.' комнатная квартира';
                        if($saveAds->rent == 1)
                        {
                            $saveAds->name = 'Сдается '.$saveAds->rooms.' комнатная квартира';
                        }
                    }
                }
                else if($data['category'] == 'комната')
                {
                    $saveAds->type  = 1;
                    if($saveAds->rooms > 1) {
                        $r = $saveAds->rooms . ' комнат' . ($saveAds->rooms < 5 ? 'ы':'');
                        $saveAds->name = 'Продается ' . $r;
                        if($saveAds->rent == 1)
                        {
                            $saveAds->name = 'Сдается ' . $r;
                        }
                    }
                    else {
                        $saveAds->name = 'Продается комната';
                        if($saveAds->rent == 1)
                        {
                            $saveAds->name = 'Сдается комната';
                        }
                    }
                    $saveAds->subtype = 1;
                }
            }
            if(isset($data['area']))
            {
                $saveAds->sq1  = $data['area']['value'];
                $saveAds->sqt1  = $data['area']['unit'] == 'кв.м.' ? 0 : 1;
            }
            if(isset($data['price']))
            {
                $saveAds->price  = $data['price']['value'];
            }
            
            if(!empty($data['location']['locality-name'])) {
                $cityName = $data['location']['locality-name'];
                $city = City::select('id')->where('name', $cityName)->first();
                if(!empty($city)) {
                    $saveAds->city_id = $city->id;
                    $saveAds->city_name = $cityName;
                }
            }
            else {
                $saveAds->city_id = 1;
                $saveAds->city_name = 'Ростов-на-Дону';
            }
            
            if(array_key_exists($data['location']['sub-locality-name'], $inarray))
            {
                $distName = $inarray[$data['location']['sub-locality-name']];
                $dist = District::select('id')->where('city_id', $saveAds->city_id)->where('name', $distName)->first();
                if(!empty($dist)) {
                    $saveAds->district_o = $dist->id;
                }
                
                $distMName = $districts[$data['location']['sub-locality-name']];
                $distM = District::select('id')->where('city_id', $saveAds->city_id)->where('name', $distMName)->first();
                if(!empty($distM)) {
                    $saveAds->district_m = $distM->id;
                }
            }
            else {
                Log::info('Unknown district: ' . $data['location']['sub-locality-name']);
            }
            
            if(isset($data['location']['address']) && empty($saveAds->address))
            {
                if(empty($saveAds->lng)) {
                    $address = 'Россия, ' . $saveAds->city_name . ', ' . trim(str_replace(array('ул.', 'улица '), array('', ''), $data['location']['address']));
                    $url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=';
                    $response = file_get_contents($url . str_replace(' ', '+', $address));
                    $json = json_decode($response, TRUE);
                    if( !empty($json['response']['GeoObjectCollection']['featureMember'][0]))
                    {
                        $geoObject = $json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject'];
                        if(in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('exact', 'number', 'street', 'near'))) {
                            $point = explode(' ', $geoObject['Point']['pos']);
                            $saveAds->lat = $point[1];
                            $saveAds->lng = $point[0];
                            if(!in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('near', 'street'))) {
                                Log::notice('Ads has ' . $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] . ' coords: ' . $saveAds->leader_id . ' ' . $geoObject['name']);
                                $saveAds->address = $geoObject['name'] . ', ' . $saveAds->city_name;
                            }
                            $components = $geoObject['metaDataProperty']['GeocoderMetaData']['Address']['Components'];
                            foreach($components as $c) {
                                if($c['kind'] == 'street') {
                                    $saveAds->street = $c['name'];
                                }
                                elseif($c['kind'] == 'house' && $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] != 'near') {
                                    $saveAds->building = $c['name'];
                                }
                            }
                        } else {
                            Log::notice('Could not get exact address info: ' . $data['location']['address']);
                        }
                    }
                    else {
                        Log::error('Could not get address info: ' . $data['location']['address']);
                    }
                }
                
                if(!empty($saveAds->lat)) {
                    $object = Object::where('lat', '=', $saveAds->lat)->where('lng', '=', $saveAds->lng)->first();
                }
                
                if(empty($object)) {
                    $address = !empty($saveAds->address) ? $saveAds->address : mb_strtolower($data['location']['address']);
                    $object = Object::where('address', 'like', '%' . $address . '%')->first();
                    if( $object )
                    {
                        $saveAds->object_id = $object->id;
                    }
                }
                
                if(empty($saveAds->address)) {
                    $saveAds->address = $data['location']['address'] . ', ' . $saveAds->city_name;
                }
                
                if(!empty($object)) {
                    $saveAds->object_id = $object->id;
                    foreach(array('material', 'complex_id', 'complex_name', 'developer_id', 'developer_name') as $field) {
                        if(empty($saveAds->$field)) {
                            $saveAds->$field = $object->$field;
                        }
                    }
                    
                    if(empty($saveAds->year) && !empty($object->year)) {
                        $saveAds->year = $object->year;
                    } elseif(empty($object->year) && !empty($saveAds->year)) {
                        $object->year = $saveAds->year;
                        $object->save();
                    }
                }
            }
            
            $saveAds->user_id = '1';

            if($saveAds->save())
            {
                $countSave++;
            }
        }
        
        $result['status'] = true;
        $result['countSave'] = $countSave;

        return $result;
    }
    
    public function chech_ads ()
    {
        $result = array(
            'status' =>false
        );
        $file = Input::get('xml', false);
        if($file)
        {
            $fname    = 'xml'.time().'.xml';
            $readFile = file_get_contents($file);
            
            if( !file_exists(base_path() .'/public/uploads/xml') )
            {
                mkdir( base_path() .'/public/uploads/xml/', 0777, true);
            }
            
            file_put_contents(base_path() . '/public/uploads/xml/'.$fname, $readFile);

            $xml   = simplexml_load_string($readFile);
            $json  = json_encode($xml);
            $array = json_decode($json,TRUE);
            $count = count($array['offer']);

            $result['status'] = true;
            $result['count'] = $count;
            $result['countNew'] = $count;
            $result['fname'] = $fname;

            foreach ($array['offer'] as $data)
            {
                $old = Ads::where('leader_id', '=', $data['@attributes']['internal-id'])->first();
                if ($old)
                {
                    $result['countNew']--;
                }
            }
        }
        return $result;
    }

}
