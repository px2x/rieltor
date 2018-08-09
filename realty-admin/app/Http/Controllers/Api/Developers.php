<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\Developer;
use App\Ads;
use App\Object;

class Developers extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $developers = Developer::select(array('id', 'name', 'description', 'created_at'));

        if( !empty($search) )
        {
            $developers->where(function ($query) use ($search) {
                $query->orWhere('name', 'like', '%' . $search . '%');
                $query->orWhere('description', 'like', '%' . $search . '%');
            });
        }
        
        $response['total'] = $developers->count();
        
        $response['data'] = $developers
                ->orderby('created_at', 'DESC')
                ->take($limit)
                ->skip($offset)
                ->get()->toArray();
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $developer = Developer::find($id);
        if( !empty($developer) )
        {
            $response = array(
                'success' => true,
                'developer' => $developer->toArray(),
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.object_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $developer = Developer::find($id);
        if( empty($developer) )
        {
            $response['message'] = trans('common.error.object_not_found');
            return response()->json($response, 404);
        }
        
        if($developer->delete())
        {
            Ads::where('developer_id', $id)->update(array('developer_id' => null, 'developer_name' => null));
            Object::where('developer_id', $id)->update(array('developer_id' => null, 'developer_name' => null));
        }
        
        $response['success'] = true;
        
        return $response;
    }
    public function save($id = null)
    {
        $response = array('success' => false);
        if( $id )
        {
            $developer = Developer::find($id);
            if( empty($developer) )
            {
                $response['message'] = trans('common.error.object_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $developer = new Developer;
        }
        
        $validFields = array('name', 'description');
        
        foreach($validFields as $field)
        {
            $v = Input::get($field);
            if( empty($v))
            {
                $v = '';
            }
            $developer->{$field} = $v;
        }
        
        if(empty($developer->name)) {
            $response['message'] = trans('common.error.name_required');
            return response()->json($response, 200);
        }
        
        if($developer->save())
        {
            $response['success'] = true;
            if( $id )
            {
                Ads::where('developer_id', $id)->update(array('developer_name' => $developer->name));
                Object::where('developer_id', $id)->update(array('developer_name' => $developer->name));
            }
            
        }
        
        return $response;
    }
}
