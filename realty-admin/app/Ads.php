<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Ads extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'ads';
    
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
    
    public function object()
    {
        return $this->belongsTo('App\Object', 'object_id');
    }
}