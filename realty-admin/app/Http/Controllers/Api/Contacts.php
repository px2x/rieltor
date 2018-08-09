<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\Setting;

class Contacts extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $setting = Setting::select(array('id', 'name', 'value'));
        
        $resp = $setting
                ->get()->toArray();
        
        $response['data'] = [];
        
        foreach ($resp as $data)
        {
            $response['data'][$data['name']] = $data['value'];
        }
        return $response;
    }
    
    public function save()
    {
        $response = array('success' => true);
        $update = array(
            'contact_skype' => Input::get('contact_skype'),
            'contact_email' => Input::get('contact_email'),
            'contact_phone' => Input::get('contact_phone')
        );
        
        foreach ($update as $key => $value)
        {
            $setting = Setting::where('name', '=', $key)->first();
            if($setting)
            {
                $setting->value = $value;
                $setting->save();
            }
            else 
            {
                $response['status'] = false;
            }
        }
        return $response;
    }
}
