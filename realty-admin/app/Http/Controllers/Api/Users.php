<?php

namespace App\Http\Controllers\Api;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;
use App\User;

class Users extends BaseController
{
    public function getList()
    {
        $response = array('success' => true);
        $page   = Input::get('page', 1);
        $limit  = Input::get('limit', 10);
        $offset = ($page - 1) * $limit;
        $search = trim(htmlspecialchars(Input::get('search', false)));
        $users = User::select(array('id', 'name', 'phone', 'email', 'created_at'))->where('id', '<>', 1);

        if( !empty($search) )
        {
            $users->where('name', 'like', '%' . $search . '%')->orWhere('phone', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
        }
        
        $response['total'] = $users->count();
//        
        $response['data'] = $users
//                ->orderby('street', 'ASC')
                ->take($limit)
                ->skip($offset)
                ->get()->toArray();
        
//        $response['total'] = 0;
//        $response['data'] = $users;
        
        return $response;
    }
    
    public function view($id)
    {
        $response = array('success' => false);
        $code = 200;
        $user = User::where('id', '=', $id);
        if( !empty($user) )
        {
            $response = array(
                'success' => true,
                'user' => $user->first()->toArray(),
            );
        }
        else
        {
            $code = 404;
            $response['message'] = trans('common.error.user_not_found');
        }
        return response()->json($response, $code, [], JSON_NUMERIC_CHECK);
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        $user = User::where('id', '=', $id);
        if( empty($user) )
        {
            $response['message'] = trans('common.error.user_not_found');
            return response()->json($response, 404);
        }
        
        $user->delete();
        $response['success'] = true;
        
        return $response;
    }
    
}
