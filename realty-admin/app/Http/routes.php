<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|AIzaSyDI32VfKihG1zarz4NEtWdyatrAzr9xL4Q
*/

$app->get('/redirect', ['middleware' => 'isAdmin', 'as' => 'main', function() {
    if(!Illuminate\Support\Facades\Auth::check())
    {
        return redirect('/login');
    }
    
    return redirect('/');
}]);

$app->get('/login', ['as' => 'login', 'uses' => 'Login@index']);
$app->post('/login', ['as' => 'loginP', 'uses' => 'Login@login']);

$app->get('/logout', ['as' => 'logout', 'uses' => 'Login@logout']);

$app->get('/', ['middleware' => 'isAdmin', 'as' => 'main', function() {
    return view('dashboard');
}]);

$app->group(['prefix' => '/api', 'middleware' => 'isAdmin', 'namespace' => 'App\Http\Controllers\Api'], function($app){
    $app->get('/dashboard', ['as' => 'dashboard', 'uses' => 'Dashboard@index']);
    $app->get('/objects', ['as' => 'objectsList', 'uses' => 'Objects@getList']);
    $app->get('/objects/{id:[0-9]+}', ['as' => 'objectView', 'uses' => 'Objects@view']);
    $app->post('/objects', ['as' => 'objectCreate', 'uses' => 'Objects@save']);
    $app->put('/objects/{id:[0-9]+}', ['as' => 'objectEdit', 'uses' => 'Objects@save']);
    $app->delete('/objects/{id:[0-9]+}', ['as' => 'objectDelete', 'uses' => 'Objects@delete']);
    
    $app->get('/developers', ['as' => 'developersSearch', 'uses' => 'Objects@getDevelopersList']);
    $app->get('/complexes', ['as' => 'complexesSearch', 'uses' => 'Objects@getComplexesList']);
    $app->get('/districts', ['as' => 'DistrictsSearch', 'uses' => 'Objects@getDistrictsList']);
    
    $app->get('/ads', ['as' => 'adsList', 'uses' => 'Ads@getList']);
    $app->get('/adds/{id:[0-9]+}', ['as' => 'adView', 'uses' => 'Ads@view']);
    $app->post('/adds', ['as' => 'adCreate', 'uses' => 'Ads@save']);
    $app->put('/adds/{id:[0-9]+}', ['as' => 'adEdit', 'uses' => 'Ads@save']);
    $app->delete('/adds/{id:[0-9]+}', ['as' => 'adDelete', 'uses' => 'Ads@delete']);
    
    $app->get('/cities', ['as' => 'citiesList', 'uses' => 'Cities@getList']);
    $app->get('/streets', ['as' => 'streetsList', 'uses' => 'Ads@streetSearch']);
    
    $app->get('/blacklist', ['as' => 'blacklist', 'uses' => 'BlackLists@getList']);
    $app->get('/blacklist/{id:[0-9]+}', ['as' => 'blacklistView', 'uses' => 'BlackLists@view']);
    $app->post('/blacklist', ['as' => 'blacklistCreate', 'uses' => 'BlackLists@save']);
    $app->put('/blacklist/{id:[0-9]+}', ['as' => 'blacklistUpdate', 'uses' => 'BlackLists@save']);
    $app->delete('/blacklist/{id:[0-9]+}', ['as' => 'blacklistDelete', 'uses' => 'BlackLists@delete']);
    
    $app->get('/contacts', ['as' => 'contactsList', 'uses' => 'Contacts@getList']);
    $app->post('/contacts', ['as' => 'contactsSave', 'uses' => 'Contacts@save']);
    $app->post('/others', ['as' => 'contactsSave', 'uses' => 'Settings@saveOthers']);
    $app->get('/others', ['as' => 'contactsSave', 'uses' => 'Settings@getOthers']);
    
    $app->get('/districts', ['as' => 'districtsList', 'uses' => 'Districts@getList']);
    $app->get('/districts/{id:[0-9]+}', ['as' => 'districtView', 'uses' => 'Districts@view']);
    $app->post('/districts', ['as' => 'districtSave', 'uses' => 'Districts@save']);
    $app->put('/districts/{id:[0-9]+}', ['as' => 'districtEdit', 'uses' => 'Districts@save']);
    $app->delete('/districts/{id:[0-9]+}', ['as' => 'districtDelete', 'uses' => 'Districts@delete']);
    
    $app->get('/developers', ['as' => 'developersList', 'uses' => 'Developers@getList']);
    $app->get('/developers/{id:[0-9]+}', ['as' => 'developerView', 'uses' => 'Developers@view']);
    $app->post('/developers', ['as' => 'developerSave', 'uses' => 'Developers@save']);
    $app->put('/developers/{id:[0-9]+}', ['as' => 'developerEdit', 'uses' => 'Developers@save']);
    $app->delete('/developers/{id:[0-9]+}', ['as' => 'developerDelete', 'uses' => 'Developers@delete']);
    
    $app->get('/complex', ['as' => 'complexList', 'uses' => 'Complexs@getList']);
    $app->get('/complex/{id:[0-9]+}', ['as' => 'complexView', 'uses' => 'Complexs@view']);
    $app->post('/complex', ['as' => 'complexSave', 'uses' => 'Complexs@save']);
    $app->put('/complex/{id:[0-9]+}', ['as' => 'complexEdit', 'uses' => 'Complexs@save']);
    $app->delete('/complex/{id:[0-9]+}', ['as' => 'complexDelete', 'uses' => 'Complexs@delete']);
    
    $app->get('/user-orders/{id:[0-9]+}', ['as' => 'ordersListFromUser', 'uses' => 'Orders@getListFromUser']);
    $app->get('/orders', ['as' => 'ordersList', 'uses' => 'Orders@getList']);
    $app->get('/orders/archive/{id:[0-9]+}', ['as' => 'archive_order', 'uses' => 'Orders@archive']);
    $app->get('/orders/{id:[0-9]+}', ['as' => 'orderView', 'uses' => 'Orders@view']);
    $app->put('/orders/{id:[0-9]+}', ['as' => 'orderEdit', 'uses' => 'Orders@save']);
    $app->delete('/orders/{id:[0-9]+}', ['as' => 'orderDelete', 'uses' => 'Orders@delete']);
    
    $app->get('/banners', ['as' => 'bannerList', 'uses' => 'Banners@getList']);
    $app->get('/banners/{id:[0-9]+}', ['as' => 'bannerView', 'uses' => 'Banners@view']);
    $app->post('/banners', ['as' => 'bannerCreate', 'uses' => 'Banners@save']);
    $app->put('/banners/{id:[0-9]+}', ['as' => 'bannerEdit', 'uses' => 'Banners@save']);
    $app->delete('/banners/{id:[0-9]+}', ['as' => 'bannerDelete', 'uses' => 'Banners@delete']);
    
    $app->get('/users', ['as' => 'userList', 'uses' => 'Users@getList']);
    $app->get('/users/{id:[0-9]+}', ['as' => 'userView', 'uses' => 'Users@view']);
    $app->post('/users', ['as' => 'userCreate', 'uses' => 'Users@save']);
    $app->put('/users/{id:[0-9]+}', ['as' => 'userEdit', 'uses' => 'Users@save']);
    $app->delete('/users/{id:[0-9]+}', ['as' => 'userDelete', 'uses' => 'Users@delete']);
    
    $app->post('/photos', ['as' => 'uploadPhoto', 'uses' => 'Photos@upload']);
    $app->delete('/photos/{id:[0-9]+}', ['as' => 'deletePhoto', 'uses' => 'Photos@delete']);
    
    
    $app->post('/importADS', ['as' => 'checkADS', 'uses' => 'Import@chech_ads']);
    $app->post('/importAdsToDatabase', ['as' => 'importAdsToDatabase', 'uses' => 'Import@importAdsToDatabase']);
    
    $app->get('/pages', ['as' => 'pageList', 'uses' => 'Pages@getList']);
    $app->get('/pages/{id:[0-9]+}', ['as' => 'pageView', 'uses' => 'Pages@view']);
    $app->post('/pages', ['as' => 'pageCreate', 'uses' => 'Pages@save']);
    $app->put('/pages/{id:[0-9]+}', ['as' => 'pageEdit', 'uses' => 'Pages@save']);
    $app->delete('/pages/{id:[0-9]+}', ['as' => 'pageDelete', 'uses' => 'Pages@delete']);
});

$app->get('{page:.*}', ['as' => 'default', 'middleware' => 'isAdmin', function() {
    return view('dashboard');
}]);