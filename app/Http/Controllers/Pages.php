<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Page;

class Pages extends Controller
{

    public function view($slug)
    {
        $page = Page::where('slug', $slug)->where('status', 'active')->first();
        if(empty($page)) {
            $contents = view('404');
            return response($contents, 404);
        }
        
        return view('page', $page->toArray());
    }

}
