<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\Ads;
use App\Order;
use App\Object;
use App\User;

class Dashboard extends BaseController
{
    public function index()
    {
        $response = array('success' => true);
        $response['orders_today'] = Order::where('created_at', '>=', date('Y-m-d') . ' 00:00:00')->count();
        $response['orders_week'] = Order::where('created_at', '>=', date('Y-m-d', strtotime('-7day')))->count();
        $response['orders_month'] = Order::where('created_at', '>=', date('Y-m-d', strtotime('-1month')))->count();
        $response['objects'] = Object::count();
        $response['users'] = User::where('id', '<>', 1)->count();
        $response['ads'] = Ads::count();
        
        return $response;
    }
}
