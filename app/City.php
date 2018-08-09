<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'cities';
    
    public function ads()
    {
        return $this->hasMany('App\Ads', 'city_id');
    }
    
    public function objects()
    {
        return $this->hasMany('App\Object', 'city_id');
    }
    
}