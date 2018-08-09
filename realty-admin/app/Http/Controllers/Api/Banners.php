<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;
use App\Banner;
use App\Photo;

class Banners extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $banners = Banner::select(array('id', 'address', 'year', 'cnt_floors', 'district_m', 'type', 'material'));

        if( !empty($search) )
        {
            $banners->where('street', 'like', '%' . $search . '%');
        }
        
//        $response['total'] = $banners->count();
//        
//        $response['data'] = $banners
//                ->orderby('street', 'ASC')
//                ->take($limit)
//                ->skip($offset)
//                ->get();
        
        $response['total'] = 0;
        $response['data'] = array();
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $banner = Banner::find($id);
        if( !empty($banner) )
        {
            $response = array(
                'success' => true,
                'banner' => $banner->toArray(),
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.banner_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function save($id = null)
    {
        $response = array('success' => false);
        if( $id )
        {
            $banner = Banner::find($id);
            if( empty($banner) )
            {
                $response['message'] = trans('common.error.banner_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $banner = new Object;
        }
        
        $validFields = array('building', 'cnt_floors', 'cnt_lifts', 
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
            $banner->{$field} = $v;
        }
        
        if( Input::has('developer_id') )
        {
            $banner->developer_id = Input::get('developer_id');
            $banner->developer_name = Input::get('developer_name');
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
                $banner->developer_id = $developer->id;
                $banner->developer_name = $developer->name;
            }
            else
            {
                $banner->developer_id = null;
                $banner->developer_name = null;
            }
        }
        
        if( Input::has('complex_id') )
        {
            $banner->complex_id = Input::get('complex_id');
            $banner->complex_name = Input::get('complex_name');
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
                $banner->complex_id = $complex->id;
                $banner->complex_name = $complex->name;
            }
            else
            {
                $banner->complex_id = null;
                $banner->complex_name = null;
            }
        }
        
        $banner->save();
        $id = $banner->id;
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
                $banner->photos()->save($photo);
                $position++;
                if( $photo->main )
                {
                    $mainPhoto = array('folder' => $photo->folder, 'filename' => $photo->filename);
                }
            }
            
            if( empty($mainPhoto) )
            {
                $photo = $banner->photos()->where('position', 1)->first();
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
                @unlink($path. $banner->id . '_th.jpg');
                @unlink($path. $banner->id . '.jpg');
                
                $originalFile = base_path() . '/public/uploads/photos/' .
                    $mainPhoto['folder'] . '/' . $mainPhoto['filename'];
                
                exec('ln -s ' . $originalFile . '_th.jpg ' . $path . $banner->id . '_th.jpg');
                exec('ln -s ' . $originalFile . '.jpg ' . $path . $banner->id . '.jpg');
            }
            else
            {
                @unlink($path. $banner->id . '_th.jpg');
                @unlink($path. $banner->id . '.jpg');
            }
            
        }
        
        $response = array('success' => true, 'id' => $id);
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $banner = Banner::find($id);
        if( empty($banner) )
        {
            $response['message'] = trans('common.error.banner_not_found');
            return response()->json($response, 404);
        }
        
        $photos = $banner->photos()->get();
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
        }
        
        $banner->delete();
        $response['success'] = true;
        
        return $response;
    }
    
}
