<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\District;
use App\City;

class Cities extends BaseController
{
    public function getList()
    {
        $type = Input::get('type', false);
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $cities = City::select(array('id', 'name', 'created_at'));

        if( !empty($search) )
        {
            $cities->where(function ($query) use ($search) {
                $query->orWhere('name', 'like', '%' . $search . '%');
            });
        }
        
        $response['total'] = $cities->count();
//        
        $response['data'] = $cities
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
        $order = Order::find($id);
        if( !empty($order) )
        {
            $response = array(
                'success' => true,
                'order' => $order->toArray(),
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
        $district = Districts::find($id);
        if( empty($district) )
        {
            $response['message'] = trans('common.error.order_not_found');
            return response()->json($response, 404);
        }
        
        $district->delete();
        $response['success'] = true;
        
        return $response;
    }
}
