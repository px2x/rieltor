<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'districts';
    
    protected $fillable = ['city_id', 'name', 'type'];
    
    public function city()
    {
        return $this->belongsTo('App\City', 'city_id');
    }
    
}