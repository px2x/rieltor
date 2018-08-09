<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use App\Order;
use App\Ads;

class BasketController extends Controller
{

    public function basket()
    {
        $result = array(
            'status' => false
        );
        $adsIDs = Input::get('ads');

        if ( !empty($adsIDs) )
        {
            $basket = Ads::select('*');
            $basket->where('id', $adsIDs[0]);

            foreach ( $adsIDs as $key => $id )
            {
                if ( $key != 0 )
                {
                    $basket->orWhere('id', $id);
                }
            }

            $result['data']   = $basket->get()->toArray();
            $result['status'] = true;
        }

        return $result;
    }

    public function sendOrder()
    {
        $result = array(
            'status' => false
        );

        $user   = Input::get('user');
        $basket = Input::get('basket');

        $order = new Order;

        $order->username = $user['username'];
        $order->phone    = $user['phone'];
        $order->order    = json_encode($basket);
        $order->comment  = $user['comment'];
        $order->status   = 'new';

        if ( $order->save() )
        {
            $result['status'] = true;
        }
        
        $emailTo = $this->_settings['contact_email'];
        if (!empty($emailTo))
        {
            Mail::send('email.new_order', ['order' => $order], function($m) use($emailTo) {
                $m->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
                $m->to($emailTo)->subject(trans('common.messages.new_order_title'));
            });
        }

        return $result;
    }

}
