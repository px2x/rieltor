<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Ads;
use App\Object;
use App\BlackList;

class AdsController extends Controller
{
    public function addNewAds(Request $request)
    {
        $result = array('status' => false);
        $validationFields = [
            'phone' => 'required|numeric',
            'address' => 'required',
            'description' => '',
            'type' => 'required|numeric|between:1,5',
            'subtype' => 'numeric|between:1,4',
            'rooms' => 'numeric|between:1,5',
            'district_m' => 'numeric',
            'district_o' => 'numeric',
            'material' => 'required|numeric|between:1,3',
            'floor_t' => 'numeric',
            'floor' => 'numeric',
            'sq1' => 'required|numeric',
            'sq2' => 'numeric',
            'sq3' => 'numeric',
            'price' => 'required|numeric',
            'condition' => 'numeric|between:1,5',
        ];
        
        $inData = $request->all();
        if(isset($inData['phone'])) {
            $inData['phone'] = str_replace(array('+7', ')', '(', ' ', '-'), array('8', '', '', '', ''), $inData['phone']);
        }
        $validator = Validator::make($inData, $validationFields);
        
        if($validator->fails()){
            $messages = $validator->errors();
            $result['message'] = array();
            foreach($messages->all() as $m) {
                $result['message'][] = $m;
            }
            
            $result['message'] = implode("\n", $result['message']);
            
            return $result;
        }
        
        $newAds = new Ads();
        foreach(array_keys($validationFields) as $f) {
            if($request->has($f)) {
                $newAds->{$f} = $inData[$f];
            }
        }
        
        $address = 'Россия, Ростов-на-Дону, ' . trim(str_replace(array('ул.', 'улица '), array('', ''), $newAds->address));
        $url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=';
        $response = file_get_contents($url . str_replace(' ', '+', $address));
        $json = json_decode($response, TRUE);
        if( !empty($json['response']['GeoObjectCollection']['featureMember'][0]))
        {
            $geoObject = $json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject'];
            if(in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('exact', 'number', 'street', 'near'))) {
                $coords = explode(' ', $geoObject['Point']['pos']);
                $newAds->lat = $coords[1];
                $newAds->lng = $coords[0];
                if(!in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('near', 'street'))) {
                    $newAds->address = $geoObject['name'];
                }
            } else {
                Log::notice('Could not get exact address info: ' . $newAds->address);
            }
        }
        else {
            Log::error('Could not get address info: ' . $newAds->address);
        }
        
        if(!empty($newAds->lat)) {
            $object = Object::where('lat', '=', $newAds->lat)->where('lng', '=', $newAds->lng)->first();
        }

        if(empty($object)) {
            $object = Object::where('address', 'like', '%' . $newAds->address . '%')->first();
        }

        if(!empty($object)) {
            $diff = array();
            $newAds->object_id = $object->id;
            foreach(array('material', 'complex_id', 'complex_name', 'developer_id', 'developer_name', 'district_m', 'district_o', 'year', 'type', 'condition') as $field) {
                if(empty($object->$field)) {
                    continue;
                }
                if(!empty($newAds->$field) && $newAds->$field != $object->$field) {
                    $diff[] = array($field, $newAds->$field, $object->$field);
                }
                $newAds->$field = $object->$field;
            }
            
            if(!empty($object->cnt_floors)){
                if($newAds->floor_t != $object->cnt_floors){
                    $diff[] = array('floor_t', $newAds->floor_t, $object->cnt_floors);
                    $newAds->floor_t = $object->cnt_floors;
                }
            }
            
            if(!empty($diff)) {
                $wMessage = 'Внимание! При создании объявления были указаны данные, отличные от имеющихся в базе:' . "\n";
                foreach($diff as $d){
                    $wMessage .= trans('common.fields.' . $d[0]) . ': ';
                    if($d[0] == 'type') {
                        $wMessage .= 'указано «' . trans('common.types.'.$d[1]) . '» - в базе «' . trans('common.types.'.$d[2]) . '»' . "\n";
                    } elseif($d[0] == 'district_m' || $d[0] == 'district_o') {
                        $ds = \App\District::select('id', 'name')->whereIn('id', array($d[1], $d[2]))->get()->toArray();
                        $districts = array();
                        foreach($ds as $dis) {
                            $districts[$dis['id']] = $dis['name'];
                        }
                        if(count($districts) != 2) {
                            if(!isset($districts[$d[1]])) { //invalid user district
                                $result['message'] = 'Указан неправильный ' . trans('common.fields.' . $d[0]);
                                return $result;
                            } else { //invalid object district
                                continue;
                            }
                        }
                        
                        $wMessage .= 'указано «' .$districts[$d[1]] . '» - в базе «' . $districts[$d[2]] . '»' . "\n";
                    }
                    else if($d[0] == 'floor_t') {
                        $wMessage .= 'указано «' .$d[1] . '» - в базе «' . $d[2] . '»' . "\n";
                    } else {
                        $wMessage .= 'указано «' . trans('common.'.$d[0].'.'.$d[1]) . '» - в базе «' . trans('common.'.$d[0].'.'.$d[2]) . '»' . "\n";
                    }
                }
                $newAds->warning = true;
                $newAds->warning_m = $wMessage;
            }
        }
        $newAds->rent = $request->has('rent');
        $newAds->status = 'pending';
        
        if($newAds->type == 1)
        {
            if($newAds->subtype == 1) {
                $newAds->name = 'Продается комната';
                if($newAds->rent == 1)
                {
                    $newAds->name = 'Сдается комната';
                }
            } elseif($newAds->subtype == 2){
                $newAds->name = 'Продается гостинка';
                if($newAds->rent == 1)
                {
                    $newAds->name = 'Сдается гостинка';
                }
            } 
            else {
                $newAds->name = 'Продается '.!empty($newAds->rooms) ? $newAds->rooms . ' комнатная квартира' : 'квартира';
                if($newAds->rent == 1)
                {
                    $newAds->name = 'Сдается '.!empty($newAds->rooms) ? $newAds->rooms . ' комнатная квартира' : 'квартира';
                }
            }
        } elseif($newAds->type == 4) {
            if($newAds->subtype == 3) {
                $newAds->name = 'Продается офис';
                if($newAds->rent == 1)
                {
                    $newAds->name = 'Сдается офис';
                }
            } elseif($newAds->subtype == 4){
                $newAds->name = 'Продается торговая площадка';
                if($newAds->rent == 1)
                {
                    $newAds->name = 'Сдается торговая площадка';
                }
            } 
            else {
                $newAds->name = 'Продается коммерческая недвижимость';
                if($newAds->rent == 1)
                {
                    $newAds->name = 'Сдается коммерческая недвижимость';
                }
            }
        } else {
            $newAds->name = 'Продается ' .  trans('common.type_name.'.$newAds->type);
            if($newAds->rent == 1)
            {
                $newAds->name = 'Сдается ' .  trans('common.type_name.'.$newAds->type);
            }
        }
        
        $checkBlack = BlackList::where('phone', $newAds->phone)->count();
        if(!empty($checkBlack)) {
            $newAds->warning = true;
            $wMessage = 'Телефон находится в черном списке!';
            if(!empty($newAds->warning_m)) {
                $newAds->warning_m = $wMessage . "\n\n" . $newAds->warning_m;
            } else {
                $newAds->warning_m = $wMessage;
            }
        }
        
        $result['status'] = $newAds->save();
        $result['message'] = trans('common.messages.add_created');
        
        $emailTo = $this->_settings['contact_email'];
        if (!empty($emailTo))
        {
            Mail::send('email.new_ads', ['ads' => $newAds], function($m) use($emailTo) {
                $m->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
                $m->to($emailTo)->subject(trans('common.messages.new_add_title'));
            });
        }

        return $result;
    }

}
