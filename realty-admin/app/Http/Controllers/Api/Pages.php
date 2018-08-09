<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Page;

class Pages extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $pages = Page::select(array('id', 'title', 'slug', 'updated_at'));

        if( !empty($search) )
        {
            $pages->where('title', 'like', '%' . $search . '%');
        }
        
        $response['total'] = $pages->count();
        
        $response['data'] = $pages
            ->orderby('title', 'ASC')
            ->take($limit)
            ->skip($offset)
            ->get();
        
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $page = Page::find($id);
        if( !empty($page) )
        {
            $response = array(
                'success' => true,
                'page' => $page->toArray(),
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.page_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function save($id = null, Request $request)
    {
        $response = array('success' => false);
        if( $id )
        {
            $page = Page::find($id);
            if( empty($page) )
            {
                $response['message'] = trans('common.error.page_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $page = new Page;
            $page->status = 'active';
        }
        
        $validationFields = [
            'title' => 'required',
            'slug' => 'required|alpha_dash|unique:pages,slug,' . $id,
            'meta_title' => '',
            'meta_keywords' => '',
            'meta_description' => '',
            'content' => '',
        ];
        $validator = Validator::make($request->all(), $validationFields);
        
        if($validator->fails()){
            $messages = $validator->errors();
            $result['message'] = array();
            foreach($messages->all() as $m) {
                $result['message'][] = $m;
            }
            
            $result['message'] = implode("\n", $result['message']);
            
            return $result;
        }
        
        foreach(array_keys($validationFields) as $f) {
            if($request->has($f)) {
                $page->{$f} = $request->get($f);
            }
        }
        
        $page->save();
        $response = array('success' => true, 'id' => $page->id);
        return response()->json($response, 200, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $page = Page::find($id);
        if( empty($page) )
        {
            $response['message'] = trans('common.error.page_not_found');
            return response()->json($response, 404);
        }
        
        $page->delete();
        $response['success'] = true;
        
        return $response;
    }
}
