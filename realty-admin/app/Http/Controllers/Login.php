<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Input;

class Login extends BaseController
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
            $result['message'] = Lang::get('common.error.auth');
        }
        return $result;
    }
    
    public function logout()
    {
        Auth::logout();
        return redirect('login');
    }
}
