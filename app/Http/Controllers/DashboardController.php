<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;
use App\District;

class DashboardController extends BaseController
{

    public function getDistrict()
    {
        $id         = Input::get('id', 1);
        $district_m = District::where('type', '=', 'm')->where('city_id', '=', $id)->get()->toArray();
        $district_o = District::where('type', '=', 'o')->where('city_id', '=', $id)->get()->toArray();

        return array('status' => true, 'district_m' => $district_m, 'district_o' => $district_o);
    }

}
