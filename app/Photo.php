<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'photos';
    
    public function buildUrl($prefix=''){
        return '/uploads/photos/' . $this->folder . '/' . $this->filename . (!empty($prefix) ? '_' . $prefix : '') . '.jpg';
    }
}