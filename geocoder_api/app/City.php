<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidModel;

class City extends Model
{
    
    use UuidModel;
    
    protected $fillable = ['name', '_countryId', '_regionId'];

    public function area()
    {
        return $this->hasMany('App\Area');
    }

    public function region()
    {
        return $this->belongsTo('App\Region');
    }

    public function country()
    {
        return $this->belongsTo('App\Country');
    }

}
