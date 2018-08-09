<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Ads;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class GetCoords extends Command {

    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'get:coords';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get coordinates of object from Google';
    

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire()
    {
        $skip = 0;
        $limit = 100;
        $url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=';
        while($objects = Ads::whereNull('street')->select(array('id', 'address'))->take($limit)->get())
        {
            if($objects->isEmpty()) {
                break;
            }
            foreach($objects as $o)
            {
                $o = $o->toArray();
                $a = $o['address'];
                $response = file_get_contents($url . str_replace(' ', '+', $a));
                $json = json_decode($response, TRUE);
                if( !empty($json['response']['GeoObjectCollection']['featureMember'][0]))
                {
                    $geoObject = $json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject'];
                    
                    if(in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('exact', 'number', 'street', 'near'))) {
                        $point = explode(' ', $geoObject['Point']['pos']);
                        $saveArray = array(
//                            'lat' => $point[1],
//                            'lng' => $point[0],
//                            'city_id' => 1,
//                            'city_name' => 'Ростов-на-Дону'
//                            'address' => $geoObject['name'] . ', Ростов-на-Дону',
                        );
                        
                        $components = $geoObject['metaDataProperty']['GeocoderMetaData']['Address']['Components'];
                        foreach($components as $c) {
                            if($c['kind'] == 'street') {
                                $saveArray['street'] = $c['name'];
                            }
                            elseif($c['kind'] == 'house' && $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] != 'near') {
                                $saveArray['building'] = $c['name'];
                            }
                        }
                        
                        if(!empty($saveArray)) {
                            DB::table('ads')->where('id', $o['id'])->update($saveArray);
                        }
//                        if(!in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('near', 'street'))) {
//                            $saveArray['address'] = $geoObject['name'] . ', Ростов-на-Дону';
//                        } elseif(!empty($saveArray['street'])) {
//                            $this->info('Object has ' . $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] . ' coords: ' . $o['id'] . ' ' . $geoObject['name']);
//                            Log::notice('Object has ' . $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] . ' coords: ' . $o['id'] . ' ' . $geoObject['name']);
//                            $saveArray['address'] = $saveArray['street'] . ', ' . $o['building'] . ', Ростов-на-Дону';
//                        }
                        
                        $this->info('Ad id: ' . $o['id']);
                    } else {
                        DB::table('ads')->where('id', $o['id'])->update(array('street' => ''));
                        $this->error('Could not get exact address info: ' . $o['id'] . ' ' . $a);
                        Log::notice('Could not get exact address info: ' . $o['address']);
                    }
                }
                else {
                    DB::table('ads')->where('id', $o['id'])->update(array('street' => ''));
                    $this->error('Could not get address info: ' . $o['id'] . ' ' . $a);
                    Log::error('Could not get address info: ' . $o['address']);
                }
            }
        }
        $this->info('Coords');
    }
    
    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire_back()
    {
        $skip = 0;
        $limit = 100;
        $address = 'Россия, г. Ростов-на-Дону, ';
//        $url = 'https://maps.google.com/maps/api/geocode/json?sensor=false&address=';
//        $url = 'https://maps.google.com/maps/api/geocode/json?sensor=false&key=' . env('GOOGLE_API_KEY', '') . '&address=';
        $url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=';
        while($objects = Object::whereNull('lat')->select(array('id', 'street', 'building', 'address'))->take($limit)->get())
        {
            if($objects->isEmpty()) {
                break;
            }
            foreach($objects as $o)
            {
                $o = $o->toArray();
                $a = $address . $o['street'];
                if( !empty($o['building']) )
                {
                    $a .= ', ' . $o['building'];
                }
                $a = trim(str_replace(array('ул.'), array(''), $a));
                $response = file_get_contents($url . str_replace(' ', '+', $a));
                $json = json_decode($response, TRUE);
                if( !empty($json['response']['GeoObjectCollection']['featureMember'][0]))
                {
                    $geoObject = $json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject'];
                    if(in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('exact', 'number', 'street', 'near'))) {
                        $point = explode(' ', $geoObject['Point']['pos']);
                        $saveArray = array(
                            'lat' => $point[1],
                            'lng' => $point[0],
                            'city_id' => 1,
                            'city_name' => 'Ростов-на-Дону'
//                            'address' => $geoObject['name'] . ', Ростов-на-Дону',
                        );
                        
                        $components = $geoObject['metaDataProperty']['GeocoderMetaData']['Address']['Components'];
                        foreach($components as $c) {
                            if($c['kind'] == 'street') {
                                $saveArray['street'] = $c['name'];
                            }
                            elseif($c['kind'] == 'house' && $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] != 'near') {
                                $saveArray['building'] = $c['name'];
                            }
                        }
                        
                        if(!in_array($geoObject['metaDataProperty']['GeocoderMetaData']['precision'], array('near', 'street'))) {
                            $saveArray['address'] = $geoObject['name'] . ', Ростов-на-Дону';
                        } elseif(!empty($saveArray['street'])) {
                            $this->info('Object has ' . $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] . ' coords: ' . $o['id'] . ' ' . $geoObject['name']);
                            Log::notice('Object has ' . $geoObject['metaDataProperty']['GeocoderMetaData']['precision'] . ' coords: ' . $o['id'] . ' ' . $geoObject['name']);
                            $saveArray['address'] = $saveArray['street'] . ', ' . $o['building'] . ', Ростов-на-Дону';
                        }
                        
                        $this->info('Object id: ' . $o['id']);
                        DB::table('objects')->where('id', $o['id'])->update($saveArray);
                    } else {
                        $this->error('Could not get exact address info: ' . $o['id'] . ' ' . $a);
                        Log::notice('Could not get exact address info: ' . $o['address']);
                    }
                }
                else {
                    $this->error('Could not get address info: ' . $o['id'] . ' ' . $a);
                    Log::error('Could not get address info: ' . $o['address']);
                }
//                if( !empty($json['status']) && $json['status'] == 'OK')
//                {
//                    $coords = array(
//                        'lat' => $json['results'][0]['geometry']['location']['lat'], 
//                        'lng' => $json['results'][0]['geometry']['location']['lng']
//                    );
//                    print_r($coords);
//                    $res = DB::table('objects')->where('id', $o['id'])->update($coords);
//                    $this->info('Object id: ' . $o['id']);
////                    sleep(1);
//                }
//                else
//                {
//                    print_r($json);
//                    $this->error('Error id:' . $o['id']);
//                    return false;
//                }
            }
        }
        $this->info('Coords');
    }

}