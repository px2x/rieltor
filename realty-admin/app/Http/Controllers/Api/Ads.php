<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;
use App\Ads as Ad;
use App\Photo;

class Ads extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $status = Input::get('status', false);
        $id = Input::get('id', false);
        $phone = Input::get('phone', false);
        $type   = intval(Input::get('type', false));
        $subtype = Input::get('subtype', false);
        $material = intval(Input::get('material', false));
        $priceFrom = intval(str_replace(' ', '', Input::get('price_from', false)));
        $priceTo = intval(str_replace(' ', '', Input::get('price_to', false)));
        $floorTFrom = intval(Input::get('floor_t_from', false));
        $floorTTo = intval(Input::get('floor_t_to', false));
        $floorFrom = intval(Input::get('floor_from', false));
        $floorTo = intval(Input::get('floor_to', false));
        $sqFrom = intval(Input::get('sq_from', false));
        $sqTo = intval(Input::get('sq_to', false));
        $roomsFrom = intval(Input::get('rooms_from', false));
        $roomsTo = intval(Input::get('rooms_to', false));
        $condition = intval(Input::get('condition', false));
        $rent = Input::get('rent');
        $warning = Input::get('warning');
        $dateFrom = Input::get('date_from', false);
        $dateTo = Input::get('date_to', false);
        $year = intval(Input::get('year', false));
        $developer = intval(Input::get('developer', false));
        $complex = intval(Input::get('complex', false));
        $districtM = intval(Input::get('district_m', false));
        $districtO = intval(Input::get('district_o', false));
        $street = Input::get('street', false);
        $building = Input::get('building', false);
        $ads = Ad::select(array('id', 'street', 'building', 'type', 'name', 'condition', 'sq1', 'price', 'status', 'warning', 'floor', 'floor_t', 'year'));

        if( !empty($id) && is_numeric($id) ) {
            $ads->where('id', $id);
        }
        else {
            if( !empty($search) ) {
                $ads->where('address', 'like', '%' . $search . '%');
            }

            if( !empty($phone) ) {
                $ads->where('phone', 'like', '%' . str_replace(' ', '', $phone) . '%');
            }

            if(!empty($status) && in_array($status, array('publish', 'pending', 'archived'))) {
                $ads->where('status', $status);
            }

            if(!empty($type) && in_array($type, array(1, 2, 3, 4, 5))) {
                $ads->where('type', $type);
            }
            
            if(is_numeric($subtype) && $subtype < 5) {
                $ads->where('subtype', intval($subtype));
            }
            
            if(!empty($material) && in_array($material, array(1, 2, 3))) {
                $ads->where(function ($query) use ($material) {
                    $query->orWhereNull('material');
                    if($material != 3) {
                        $query->orWhereIn('material', array($material, 3));
                    } else {
                        $query->orWhere('material', $material);
                    }
                });
            }
            
            if(!empty($priceFrom)) {
                $ads->where('price', '>=', $priceFrom)->orderBy('price', 'ASC');
            }
            
            if(!empty($priceTo)) {
                $ads->where('price', '<=', $priceTo)->orderBy('price', 'ASC');
            }
            
            if(!empty($floorTFrom)) {
                $ads->where('floor_t', '>=', $floorTFrom)->orderBy('floor_t', 'ASC');
            }
            
            if(!empty($floorTTo)) {
                $ads->where('floor_t', '<=', $floorTTo)->orderBy('floor_t', 'ASC');
            }
            
            if(!empty($floorFrom)) {
                $ads->where('floor', '>=', $floorFrom)->orderBy('floor', 'ASC');
            }
            
            if(!empty($floorTo)) {
                $ads->where('floor', '<=', $floorTo)->orderBy('floor', 'ASC');
            }
            
            if(!empty($sqFrom)) {
                $ads->where('sq1', '>=', $sqFrom)->orderBy('sq1', 'ASC');
            }
            
            if(!empty($sqTo)) {
                $ads->where('sq1', '<=', $sqTo)->orderBy('sq1', 'ASC');
            }
            
            if(!empty($roomsFrom)) {
                $ads->where('rooms', '>=', $roomsFrom);
            }
            
            if(!empty($roomsTo)) {
                $ads->where('rooms', '<=', $roomsTo);
            }
            
            if(!empty($condition)) {
                $ads->where(function ($query) use ($condition) {
                    $query->orWhereNull('condition')->orWhere('condition', $condition);
                });
            }
            
            if(!empty($year)) {
                $ads->where(function ($query) use ($year) {
                    $query->orWhereNull('year')->orWhere('year', '>=', $year);
                });
            }
            
            if(!empty($rent) && $rent == 'true') {
                $ads->where('rent', 1);
            }
            
            if(!empty($warning) && $warning == 'true') {
                $ads->where('warning', 1);
            }
            
            if(!empty($dateFrom)) {
                $df = strtotime($dateFrom);
                if(!empty($df)) {
                    $ads->where('published_at', '>=', date('Y-m-d', $df));
                }
            }
            
            if(!empty($dateTo)) {
                $dt = strtotime($dateTo);
                if(!empty($dt)) {
                    $ads->where('published_at', '<=', date('Y-m-d', $dt));
                }
            }
            
            if(!empty($developer)) {
                $ads->where('developer_id', $developer);
            }
            
            if(!empty($complex)) {
                $ads->where('complex_id', $complex);
            }
            
            if(!empty($districtM)) {
                $ads->where('district_m', $districtM)->orderBy('street', 'ASC');
            }
            
            if(!empty($districtO)) {
                $ads->where('district_o', $districtO)->orderBy('street', 'ASC');
            }
            
            if(!empty($street)) {
                $ads->where('street', $street);
            }
            
            if(!empty($building)) {
                $ads->where('building', $building);
            }
        }
        
        $response['total'] = $ads->count();
        $response['count'] = $ads->count();
        
        $response['data'] = $ads
                ->orderby('id', 'ASC')
                ->take($limit)
                ->skip($offset)
                ->get();
        
//        $response['total'] = 0;
//        $response['data'] = [];
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $ad = Ad::find($id);
        if( !empty($ad) )
        {
            $photos = $ad->photos()
                    ->select(array('id', 'description', 'folder', 'filename', 'main'))
                    ->orderby('position', 'ASC')
                    ->get();
            
            if(!empty($ad->warning_m)) {
                $ad->warning_m = nl2br($ad->warning_m);
            }
            
            $response = array(
                'success' => true,
                'ad' => $ad->toArray(),
                'districts' => \App\District::select('id', 'name', 'type')->get()->toArray(),
                'photos' => $photos->toArray()
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.ad_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function save($id = null)
    {
        $response = array('success' => false);
        if( $id )
        {
            $ad = Ad::find($id);
            if( empty($ad) )
            {
                $response['message'] = trans('common.error.ad_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $ad = new Ad;
        }
        $validFields = array('user_id', 'object_id', 'name', 'address', 'type', 
            'rent', 'subtype', 'rooms', 'floor', 'floor_t', 'material', 'description', 'comment', 'district_o', 'district_m',
            'sq1', 'sqt1', 'sq2', 'sq3', 'sq4', 'sqt4', 'price', 'price_d', 'condition', 'popular', 'developer_id',
            'developer_name', 'complex_id', 'complex_name', 'lat', 'lng', 'year', 'phone'
        );
        
        foreach($validFields as $field)
        {
            $v = Input::get($field);
            if( !isset($v))
            {
                continue;
//                $v = null;
            }
            $ad->{$field} = $v;
        }
        
        if($ad->status != 'publish' && !empty(Input::get('publish'))) {
            $ad->status = 'publish';
            $ad->published_at = date('Y-m-d H:m:s');
        } elseif($ad->status == 'publish' && empty(Input::get('publish'))) {
            $ad->status = 'archived';
        }
        
        $ad->lat = substr($ad->lat, 0, strpos($ad->lat, '.') + 7);
        $ad->lng = substr($ad->lng, 0, strpos($ad->lng, '.') + 7);
        
        if( Input::has('developer_id') )
        {
            $ad->developer_id = Input::get('developer_id');
            $ad->developer_name = Input::get('developer_name');
        }
        else
        {
            $name = trim(htmlspecialchars(Input::get('developer_name')));
            if( !empty($name) )
            {
                $developer = \App\Developer::where('name',$name)->first();
                if( empty($developer) )
                {
                    $developer = new \App\Developer();
                    $developer->name = $name;
                    $developer->save();
                }
                $ad->developer_id = $developer->id;
                $ad->developer_name = $developer->name;
            }
            else
            {
                $ad->developer_id = null;
                $ad->developer_name = null;
            }
        }
        
        if( Input::has('complex_id') )
        {
            $ad->complex_id = Input::get('complex_id');
            $ad->complex_name = Input::get('complex_name');
        }
        else
        {
            $name = trim(htmlspecialchars(Input::get('complex_name')));
            if (!empty($name) )
            {
                $complex = \App\Complex::where('name', $name)->first();
                if( empty($complex) )
                {
                    $complex = new \App\Complex();
                    $complex->name = $name;
                    $complex->save();
                }
                $ad->complex_id = $complex->id;
                $ad->complex_name = $complex->name;
            }
            else
            {
                $ad->complex_id = null;
                $ad->complex_name = null;
            }
        }
        
        //temp fix
        $ad->city_id = 1;
        $ad->city_name = 'Ростов-на-Дону';
        
        if(Input::has('warning_reset')) {
            $ad->warning = false;
            $ad->warning_m = '';
        }
        
        $ad->save();
        $id = $ad->id;
        $photos = Input::get('photos');
        
        if( !empty($photos) )
        {
            $position = 1;
            $mainPhoto = false;
            foreach($photos as $p)
            {
                $photo = Photo::find($p['id']);
                if( empty($photo) )
                {
                    continue;
                }
                
                //if photo was set as deleted
                if( !empty($p['deleted']) )
                {
                    $path = base_path() . '/public/uploads/photos/' . $photo->folder . '/' . $photo->filename;
                    @unlink($path . '.jpg');
                    @unlink($path . '_th.jpg');
                    @unlink($path . '_o.jpg');
                    $photo->delete();
                    continue;
                }
                
                $photo->main = !empty($p['main']);
                $photo->description = !empty($p['description']) ? $p['description'] : '';
                $photo->position = $position;
                $ad->photos()->save($photo);
                $position++;
                if( $photo->main )
                {
                    $mainPhoto = array('folder' => $photo->folder, 'filename' => $photo->filename);
                }
            }
            
            if( empty($mainPhoto) )
            {
                $photo = $ad->photos()->where('position', 1)->first();
                if( !empty($photo) )
                {
                    $mainPhoto = array('folder' => $photo->folder, 'filename' => $photo->filename);
                }
            }
            
            $path = base_path() . '/public/uploads/ads/';
            if( !empty($mainPhoto) )
            {
                if( !is_dir($path) )
                {
                    mkdir($path, 0777, true);
                }
                @unlink($path. $ad->id . '_th.jpg');
                @unlink($path. $ad->id . '.jpg');
                
                $originalFile = base_path() . '/public/uploads/photos/' .
                    $mainPhoto['folder'] . '/' . $mainPhoto['filename'];
                
                exec('ln -s ' . $originalFile . '_th.jpg ' . $path . $ad->id . '_th.jpg');
                exec('ln -s ' . $originalFile . '.jpg ' . $path . $ad->id . '.jpg');
            }
            else
            {
                @unlink($path. $ad->id . '_th.jpg');
                @unlink($path. $ad->id . '.jpg');
            }
            
        }
        
        $response = array('success' => true, 'id' => $id);
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $ad = Ad::find($id);
        if( empty($ad) )
        {
            $response['message'] = trans('common.error.ad_not_found');
            return response()->json($response, 404);
        }
        
        $photos = $ad->photos()->get();
        if( !empty($photos) )
        {
            foreach($photos as $photo)
            {
                $path = base_path() . '/public/uploads/photos/' . $photo->folder . '/' . $photo->filename;
                @unlink($path . '.jpg');
                @unlink($path . '_th.jpg');
                @unlink($path . '_o.jpg');
                $photo->delete();
            }
            @unlink(base_path() . '/public/uploads/objects/'. $ad->id . '_th.jpg');
            @unlink(base_path() . '/public/uploads/objects/'. $ad->id . '.jpg');
        }
        
        $ad->delete();
        $response['success'] = true;
        
        return $response;
    }
    
    public function streetSearch(){
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $ads = Ad::select(array('id', 'street'));

        if( !empty($search) )
        {
            $ads->where('street', 'like', '%' . $search . '%');
        }
        
        $res = $ads
            ->orderby('street', 'ASC')
            ->take($limit)
            ->skip($offset)
            ->groupby('street')
            ->get()->toArray();
        
        $response['data'] = array();
        foreach($res as $a) {
            $response['data'][] = $a['street'];
        }
        
        return $response;
    }
}
