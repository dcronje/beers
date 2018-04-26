<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidModel;

class Region extends Model
{

    use UuidModel;
    
    protected $fillable = ['name', '_countryId'];

    public function area()
    {
        return $this->hasMany('App\Area');
    }

    public function city()
    {
        return $this->hasMany('App\City');
    }

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

}
