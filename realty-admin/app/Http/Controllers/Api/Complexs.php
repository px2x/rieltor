<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\Complex;
use App\Ads;
use App\Object;

class Complexs extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $complexes = Complex::select(array('id', 'name', 'description', 'created_at'));

        if( !empty($search) )
        {
            $complexes->where(function ($query) use ($search) {
                $query->orWhere('name', 'like', '%' . $search . '%');
                $query->orWhere('description', 'like', '%' . $search . '%');
            });
        }
        
        $response['total'] = $complexes->count();
        
        $response['data'] = $complexes
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
        $complex = Complex::find($id);
        if( !empty($complex) )
        {
            $response = array(
                'success' => true,
                'complex' => $complex->toArray(),
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
        $complex = Complex::find($id);
        if( empty($complex) )
        {
            $response['message'] = trans('common.error.object_not_found');
            return response()->json($response, 404);
        }
        
        if($complex->delete())
        {
            Ads::where('complex_id', $id)->update(array('complex_id' => null, 'complex_name' => null));
            Object::where('complex_id', $id)->update(array('complex_id' => null, 'complex_name' => null));
        }
        
        $response['success'] = true;
        
        return $response;
    }
    public function save($id = null)
    {
        $response = array('success' => false);
        if( $id )
        {
            $complex = Complex::find($id);
            if( empty($complex) )
            {
                $response['message'] = trans('common.error.object_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $complex = new Complex;
        }
        
        $validFields = array('name', 'description');
        
        foreach($validFields as $field)
        {
            $v = Input::get($field);
            if( empty($v))
            {
                $v = '';
            }
            $complex->{$field} = $v;
        }
        
        if(empty($complex->name)) {
            $response['message'] = trans('common.error.name_required');
            return response()->json($response, 403);
        }
        
        if($complex->save())
        {
            $response['success'] = true;
            if( $id )
            {
                Ads::where('complex_id', $id)->update(array('complex_name' => $complex->name));
                Object::where('complex_id', $id)->update(array('complex_name' => $complex->name));
            }
        }
        
        return $response;
    }
}
