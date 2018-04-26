<?php
namespace App\GraphQL\City;

use App\GraphQL\Exporter;

class CityExporter implements Exporter {

    static function getTypes()
    {
        return [
            'City' => 'App\GraphQL\City\Types\CityType',
            'CityListDirectionEnum' => 'App\GraphQL\City\Types\CityListDirectionEnumType',
            'CityListFilters' => 'App\GraphQL\City\Types\CityListFiltersType',
            'CityListOrderEnum' => 'App\GraphQL\City\Types\CityListOrderEnumType',
            'CityListOrder' => 'App\GraphQL\City\Types\CityListOrderType',
            'CityList' => 'App\GraphQL\City\Types\CityListType',
            'CityAddInput' => 'App\GraphQL\City\Types\CityAddInputType',
            'CityUpdateInput' => 'App\GraphQL\City\Types\CityUpdateInputType',
        ];
    }

    static function getQueries()
    {
        return [
            'AllCities' => 'App\GraphQL\City\Queries\AllCitiesQuery',
            'CityCount' => 'App\GraphQL\City\Queries\CityCountQuery',
            'OneCity' => 'App\GraphQL\City\Queries\OneCityQuery',
        ];
    }

    static function getMutations()
    {
        return [
            'AddCity' => 'App\GraphQL\City\Mutations\AddCityMutation',
            'RemoveCity' => 'App\GraphQL\City\Mutations\RemoveCityMutation',
            'UpdateCity' => 'App\GraphQL\City\Mutations\UpdateCityMutation',
        ];
    }

}