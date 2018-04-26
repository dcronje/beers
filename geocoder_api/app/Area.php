<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidModel;

class Area extends Model
{
    
    use UuidModel;
    
    protected $fillable = ['name', '_countryId', '_regionId', '_cityId'];

    public function city()
    {
        return $this->belongsTo('App\City');
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
