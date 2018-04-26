<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidModel;

class Location extends Model
{

    use UuidModel;
    
    protected $fillable = ['name', 'building', 'address', 'longitude', 'latitude', '_countryId', '_regionId', '_cityId', '_areaId', 'timezone'];

    public function area() {
        return $this->belongsTo('App/Area');
    }

    public function city() {
        return $this->belongsTo('App/City');
    }

    public function region() {
        return $this->belongsTo('App/Region');
    }

    public function country() {
        return $this->belongsTo('App/Country');
    }

}
