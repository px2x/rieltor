<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;
use App\Object;
use App\Photo;

class Objects extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $coords = Input::get('coords', false);
        $objects = Object::select(array('id', 'address', 'year', 'cnt_floors', 'district_m', 'type', 'material'));

        if( !empty($search) )
        {
            $objects->where('street', 'like', '%' . $search . '%');
        }
        elseif( !empty($coords) )
        {
            $lat = substr($coords['lat'], 0, strpos($coords['lat'], '.') + 7);
            $lng = substr($coords['lng'], 0, strpos($coords['lng'], '.') + 7);
            
            $objects->select(array('id', 'type', 'material', 'district_m',
                'district_o', 'developer_id', 'developer_name', 'complex_id', 'complex_name', 
                'cnt_floors', 'sq1_c', 'sq1_l', 'sq1_k', 'sq2_c', 'sq2_l', 'sq2_k', 
                'sq3_c', 'sq3_l', 'sq3_k', 'cnt_lifts', 'condition', 'cnt_porchs', 'description', 'comment', 'lat', 'lng'))
                ->where('lat', $lat)
                ->where('lng', $lng);
        }
        
        $response['total'] = $objects->count();
        
        $response['data'] = $objects
                ->orderby('street', 'ASC')
                ->take($limit)
                ->skip($offset)
                ->get();
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $object = Object::find($id);
        if( !empty($object) )
        {
            $ads = $object->ads()->get();
            $photos = $object->photos()
                    ->select(array('id', 'description', 'folder', 'filename', 'main'))
                    ->orderby('position', 'ASC')
                    ->get();
            
            $response = array(
                'success' => true,
                'object' => $object->toArray(),
                'districts' => \App\District::select('id', 'name', 'type')->get()->toArray(),
                'ads' => $ads->toArray(),
                'photos' => $photos->toArray()
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.object_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function save($id = null)
    {
        $response = array('success' => false);
        if( $id )
        {
            $object = Object::find($id);
            if( empty($object) )
            {
                $response['message'] = trans('common.error.object_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $object = new Object;
        }
        
        $validFields = array('building', 'cnt_floors', 'cnt_lifts', 'address',
            'cnt_porchs', 'comment', 'condition', 'description', 
            'district_m', 'district_o', 'housing', 'last_cap', 'last_el', 
            'last_fasade', 'last_roof', 'lat', 'lifts_changed', 'lng', 
            'material','sq1_c', 'sq1_k', 'sq1_l', 'sq2_c', 'sq2_k', 
            'sq2_l', 'sq3_c', 'sq3_k', 'sq3_l', 'street', 'type', 'year'
        );
        
        foreach($validFields as $field)
        {
            $v = Input::get($field);
            if( empty($v))
            {
                $v = null;
            }
            $object->{$field} = $v;
        }
        
        if( Input::has('developer_id') )
        {
            $object->developer_id = Input::get('developer_id');
            $object->developer_name = Input::get('developer_name');
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
                $object->developer_id = $developer->id;
                $object->developer_name = $developer->name;
            }
            else
            {
                $object->developer_id = null;
                $object->developer_name = null;
            }
        }
        
        if( Input::has('complex_id') )
        {
            $object->complex_id = Input::get('complex_id');
            $object->complex_name = Input::get('complex_name');
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
                $object->complex_id = $complex->id;
                $object->complex_name = $complex->name;
            }
            else
            {
                $object->complex_id = null;
                $object->complex_name = null;
            }
        }
        
        $object->lat = substr($object->lat, 0, strpos($object->lat, '.') + 7);
        $object->lng = substr($object->lng, 0, strpos($object->lng, '.') + 7);
        
        $object->city_id = 1;
        $object->city_name = 'Ростов-на-Дону';
        
        $object->save();
        $id = $object->id;
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
                $object->photos()->save($photo);
                $position++;
                if( $photo->main )
                {
                    $mainPhoto = array('folder' => $photo->folder, 'filename' => $photo->filename);
                }
            }
            
            if( empty($mainPhoto) )
            {
                $photo = $object->photos()->where('position', 1)->first();
                if( !empty($photo) )
                {
                    $photo->main = true;
                    $photo->save();
                    $mainPhoto = array('folder' => $photo->folder, 'filename' => $photo->filename);
                }
            }
            
            $path = base_path() . '/public/uploads/objects/';
            if( !empty($mainPhoto) )
            {
                if( !is_dir($path) )
                {
                    mkdir($path, 0777, true);
                }
                @unlink($path. $object->id . '_th.jpg');
                @unlink($path. $object->id . '.jpg');
                
                $originalFile = base_path() . '/public/uploads/photos/' .
                    $mainPhoto['folder'] . '/' . $mainPhoto['filename'];
                
                exec('ln -s ' . $originalFile . '_th.jpg ' . $path . $object->id . '_th.jpg');
                exec('ln -s ' . $originalFile . '.jpg ' . $path . $object->id . '.jpg');
            }
            else
            {
                @unlink($path. $object->id . '_th.jpg');
                @unlink($path. $object->id . '.jpg');
            }
            
        }
        
        $response = array('success' => true, 'id' => $id);
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $object = Object::find($id);
        if( empty($object) )
        {
            $response['message'] = trans('common.error.object_not_found');
            return response()->json($response, 404);
        }
        
        $photos = $object->photos()->get();
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
            @unlink(base_path() . '/public/uploads/objects/'. $object->id . '_th.jpg');
            @unlink(base_path() . '/public/uploads/objects/'. $object->id . '.jpg');
        }
        
//        $ads = $object->ads();
//        if( !empty($ads) )
//        {
//            foreach($ads as $ad)
//            {
//                $object->detach($ad->id);
//            }
//        }
        $object->delete();
        $response['success'] = true;
        
        return $response;
    }
    
    public function getDevelopersList()
    {
        $response = array('success' => true);
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $developers = \App\Developer::select(array('id', 'name'));

        if( !empty($search) )
        {
            $developers->where('name', 'like', '%' . $search . '%');
        }
        
        $response['data'] = $developers
                ->orderby('name', 'ASC')
                ->take(10)
                ->skip(0)
                ->get();
        
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
    
    public function getComplexesList()
    {
        $response = array('success' => true);
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $complexes = \App\Complex::select(array('id', 'name'));

        if( !empty($search) )
        {
            $complexes->where('name', 'like', '%' . $search . '%');
        }
        
        $response['data'] = $complexes
                ->orderby('name', 'ASC')
                ->take(10)
                ->skip(0)
                ->get();
        
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
    
    public function getDistrictsList()
    {
        $response = array('success' => true);
        $districts = \App\District::select(array('id', 'name', 'city_id', 'type'));

        $response['data'] = $districts
                ->orderby('name', 'ASC')
                ->get();
        
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
}
