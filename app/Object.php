<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Object extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'objects';
    
    public function ads()
    {
        return $this->hasMany('App\Ads', 'object_id');
    }
    
    public function photos()
    {
        return $this->morphMany('App\Photo', 'item');
    }
    
    public function complex()
    {
        return $this->belongsTo('App\Complex', 'complex_id');
    }
    
    public function developer()
    {
        return $this->belongsTo('App\Developer', 'developer_id');
    }
    
}