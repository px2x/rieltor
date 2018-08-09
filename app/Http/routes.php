<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It is a breeze. Simply tell Lumen the URIs it should respond to
  | and give it the Closure to call when that URI is requested.
  |
 */

$app->get('/', ['as' => 'index', 'uses' => 'Welcome@index']);
$app->get('/home', ['as' => 'index', 'uses' => 'Welcome@index']);


$app->get('/ads', ['as' => 'ads', 'uses' => 'Catalog@index']);
$app->get('/table', ['as' => 'ads', 'uses' => 'Catalog@table']);
$app->get('/ads/{id:[0-9]+}', ['as' => 'adsItem', 'uses' => 'Catalog@item']);
$app->get('/cart', ['as' => 'cart', 'uses' => 'Catalog@cart']);
$app->get('/map', ['as' => 'cart', 'uses' => 'Catalog@map']);

$app->get('/api/streets', ['as' => 'streetsSearch', 'uses' => 'Catalog@streets']);


$app->get('/district', ['as' => 'getDistrict', 'uses' => 'DashboardController@getDistrict']);
$app->post('/basket', ['as' => 'getBasket', 'uses' => 'BasketController@basket']);
$app->post('/addNewAds', ['as' => 'addNewAds', 'uses' => 'AdsController@addNewAds']);
$app->post('/sendOrder', ['as' => 'sendOrder', 'uses' => 'BasketController@sendOrder']);

$app->get('/{slug:[0-9a-z_-]+}', ['as' => 'page', 'uses' => 'Pages@view']);