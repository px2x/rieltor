<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Input;
use App\Setting;

class Settings extends BaseController
{
    public function index()
    {
        return view('layout.login');
    }
    
    public function login()
    {
        $result = array('success' => false);
        
        $email = addslashes(Input::get('email'));
        $remember = Input::get('remember');
        
        if(Auth::attempt(array('email' => $email, 'password' => Input::get('password')), $remember))
        {
            $result['success'] = true;
        }
        else
        {
            $result['message'] = Lang::get('common.error.user_not_found');
        }
        return $result;
    }
    
    public function logout()
    {
        Auth::logout();
        return redirect('login');
    }
    
    public function saveOthers() 
    {
        $others   = Input::get('other', array());
        
        foreach($others as $key => $vall) 
        {
            if ($tmp = Setting::where('name', $key)->first())
            {
                $saving = $tmp;
            }
            else 
            {
                $saving = new Setting;
            }
            $saving->name = $key;
            $saving->value = $vall;
            $saving->save();
        }
        return array('status' => true);
    }
    public function getOthers() 
    {
        $array = Setting::select('*')->get()->toArray();
        $settings = array();
        foreach($array as $setting)
        {
            $settings[$setting['name']] = $setting['value'];
        }
        
        return array('status' => true, 'res' => $settings);
    }
}
