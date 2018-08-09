<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'banners';
    
    public function photos()
    {
        return $this->morphMany('App\Photo', 'item');
    }
    
}