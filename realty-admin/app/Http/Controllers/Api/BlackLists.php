<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;

use App\BlackList;

class BlackLists extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $blackLists = BlackList::select(array('id', 'phone', 'comment'
            . '', 'created_at'));

        if( !empty($search) )
        {
            $blackLists->where(function ($query) use ($search) {
                $query
                    ->where('comment', 'like', '%' . $search . '%')
                    ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }
        
        $response['total'] = $blackLists->count();
        
        $response['data'] = $blackLists
                ->orderby('created_at', 'DESC')
                ->take($limit)
                ->skip($offset)
                ->get()->toArray();
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $black = BlackList::find($id);
        if( !empty($black) )
        {
            $response = array(
                'success' => true,
                'black' => $black->toArray(),
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.phone_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $blackList = BlackList::find($id);
        if( empty($blackList) )
        {
            $response['message'] = trans('common.error.phone_not_found');
            return response()->json($response, 404);
        }
        
        if($blackList->delete())
        {
            $response['success'] = true;
        }
        
        return $response;
    }
    
    public function save($id = null)
    {
        $response = array('success' => false);
        $phone      = Input::get('phone');
        $comment    = Input::get('comment');
        $phone = preg_replace('~[^0-9]~', '', $phone);
        
        if( $id )
        {
            $black = BlackList::find($id);
            if( empty($black) )
            {
                $response['message'] = trans('common.error.phone_not_found');
                return response()->json($response, 404);
            }
        }
        else
        {
            $black = new BlackList;
        }
        
        if(empty($phone)) {
            $response['message'] = trans('common.error.phone_required');
            return response()->json($response, 400);
        }
        
        $exists = BlackList::where('phone', '=', $phone)->first();
        if(!empty($exists)) {
            if(!$id || $id != $exists->id) {
                $response['message'] = trans('common.error.phone_exists');
                return response()->json($response, 400);
            }
        }
        
        $black->phone = $phone;
        $black->comment = $comment;
        
        if($black->save())
        {
            $response['success'] = true;
        }
        
        return $response;
    }
    
}
