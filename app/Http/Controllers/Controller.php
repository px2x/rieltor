<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use App\Setting;

class Controller extends BaseController
{
    protected $_settings = array();
    
    public function __construct()
    {
        $res = Setting::select(array('name', 'value'))->get();
        foreach($res as $s) {
            $this->_settings[$s['name']] = $s['value'];
        }
        
        view()->share('topPhone', $this->_settings['top_phone']);
    }

}
