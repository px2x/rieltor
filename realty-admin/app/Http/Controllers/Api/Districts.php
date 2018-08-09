<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\District;
use App\City;
use App\Ads;
use App\Object;

class Districts extends BaseController
{
    public function getList()
    {
        $type = Input::get('type', false);
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $districts = District::select(array('id', 'city_id', 'name', 'type', 'created_at'));

        if( !empty($type) && $type != 'None' )
        {
            $districts->where('type', '=', $type);
        }
        if( !empty($search) )
        {
            $districts->where(function ($query) use ($search) {
                $query->orWhere('name', 'like', '%' . $search . '%');
            });
        }
        
        $response['total'] = $districts->count();
        
        $resp = $districts
                ->orderby('created_at', 'DESC')
                ->take($limit)
                ->skip($offset)
                ->get()->toArray();
        
        $citys = City::select(array('id', 'name'))->get()->toArray();
        
        foreach ($resp as $key => $data)
        {
            foreach ($citys as $city)
            {
                if($city['id'] == $data['city_id'])
                {
                    $resp[$key]['city'] = $city['name'];
                }
            }
        }
        $response['data'] = $resp;
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $district = District::find($id);
        if( !empty($district) )
        {
            $response = array(
                'success' => true,
                'district' => $district->toArray(),
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.order_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $district = District::find($id);
        if( empty($district) )
        {
            $response['message'] = trans('common.error.order_not_found');
            return response()->json($response, 404);
        }
        
        if($district->delete())
        {
            if($district->type == 'o') {
                Ads::where('district_o', $id)->update(array('district_o' => null));
                Object::where('district_o', $id)->update(array('district_o' => null));
            } else {
                Ads::where('district_m', $id)->update(array('district_m' => null));
                Object::where('district_m', $id)->update(array('district_m' => null));
            }
            $response['success'] = true;
        }
        
        return $response;
    }
    public function save($id = null)
    {
        $response = array('success' => false);
        if( $id )
        {
            $district = District::find($id);
            if( empty($district) )
            {
                $response['message'] = trans('common.error.object_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $district = new District;
        }
        
        $validFields = array('city_id', 'name', 'type');
        
        foreach($validFields as $field)
        {
            $v = Input::get($field);
            if( empty($v))
            {
                $response['message'] = trans('common.error.all_required');
                return response()->json($response, 200);
            }
            $district->{$field} = $v;
        }
        
        if($district->save())
        {
            $response['success'] = true;
        }
        
        return $response;
    }
}
