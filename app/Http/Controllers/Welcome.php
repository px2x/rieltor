<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\District;
use App\City;
use App\Ads;

class Welcome extends Controller
{

    protected function _getCount($rent)
    {
        if ( $rent === 0 )
        {
            $counters = session('counters', false);
        }
        else
        {
            $counters = session('counters_rent', false);
        }
        if ( empty($counters) )
        {
            $result   = Ads::select(DB::raw('COUNT(id) cnt'), 'type')
                ->where('rent', $rent)
                ->groupby('type')
                ->get()
                ->toArray();
            $counters = array();
            foreach ( $result as $r )
            {
                $counters[$r['type']] = $r['cnt'];
            }
            $counters['rent'] = Ads::where('rent', 1)->count();
            if ( $rent === 0 )
            {
                session(array('counters' => $counters));
            }
            else
            {
                session(array('counters_rent' => $counters));
            }
        }
        return $counters;
    }

    public function index()
    {
        $years = array();
        for($year = 1945; $year <= date('Y'); $year+=5) {
            $years[] = $year;
        }
        if(date('Y')%5 !== 0) {
            $years[] = date('Y');
        }
        
        $ads = Ads::select('id', 'name', 'address', 'price')
            ->where('status', 'publish')
            ->orderBy('published_at', 'DESC')
            ->limit(25)
            ->get()
            ->toArray();
        
        return view('index')
            ->with(array(
                'counters'      => $this->_getCount(0),
                'counters_rent' => $this->_getCount(1),
                'district_o'    => District::where('type', 'o')->get()->toArray(),
                'district_m'    => District::where('type', 'm')->get()->toArray(),
                'cities'        => City::select('id', 'name')->get()->toArray(),
                'years'         => $years,
                'ads'           => $ads
        ));
    }

}
