<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\Order;
use App\Ads;

class Orders extends BaseController
{
    public function getList()
    {
        $status = Input::get('status', false);
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $orders = Order::select(array('id', 'comment', 'username', 'phone', 'created_at', 'status'));

        if( !empty($status) && $status != 'None' )
        {
            $orders->where('status', '=', $status);
        }
        if( !empty($search) )
        {
            $orders->where(function ($query) use ($search) {
                $query->orWhere('comment', 'like', '%' . $search . '%');
                $query->orWhere('username', 'like', '%' . $search . '%');
                $query->orWhere('phone', 'like', '%' . $search . '%');
            });
        }
        
        $response['total'] = $orders->count();
//        
        $response['data'] = $orders
                ->orderby('created_at', 'DESC')
                ->take($limit)
                ->skip($offset)
                ->get();
        
        return $response;
    }
    public function getListFromUser($id)
    {
        $response = array('success' => true);
        $orders = Order::select(array('id', 'date'))->where('user_id', '=', $id);

        $response['total'] = $orders->count();
        
        $response['data'] = $orders
                ->orderby('date', 'DESC')
                ->get()->toArray();;
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $order = Order::find($id);
        if( !empty($order) )
        {
            
            $adsID = json_decode($order->order);
            $ads = array();
            
            
            foreach ( $adsID as $row )
            {
                $ads[] = Ads::select('id', 'price', 'name', 'address', 'phone')->where('id', $row)->first()->toArray();
            }

            $tmp = $order->order;

            $order->order  = $ads;

            $response = array(
                'success' => true,
                'order' => $order->toArray(),
            );
            if ( $order->status == 'new' )
            {
                $saveOrder = $order;
                $saveOrder->status = 'viewed';
                $order->order = $tmp ;
                $saveOrder->save();
            }
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
        $order = Order::find($id);
        if( empty($order) )
        {
            $response['message'] = trans('common.error.order_not_found');
            return response()->json($response, 404);
        }
        
        $order->delete();
        $response['success'] = true;
        
        return $response;
    }
    
    public function archive($id)
    {
        $response = array('success' => false);
        $order = Order::find($id);

        if( empty($order) )
        {
            $response['message'] = trans('common.error.order_not_found');
            return response()->json($response, 404);
        }

        $order->status = 'archived';
        $order->save();

        $response['success'] = true;
        
        return $response;
    }
}
