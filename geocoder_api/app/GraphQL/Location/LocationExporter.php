<?php
namespace App\GraphQL\Location;

use App\GraphQL\Exporter;

class LocationExporter implements Exporter {

    static function getTypes()
    {
        return [
            'Location' => 'App\GraphQL\Location\Types\LocationType',
            'LocationListDirectionEnum' => 'App\GraphQL\Location\Types\LocationListDirectionEnumType',
            'LocationListFilters' => 'App\GraphQL\Location\Types\LocationListFiltersType',
            'LocationListOrderEnum' => 'App\GraphQL\Location\Types\LocationListOrderEnumType',
            'LocationListOrder' => 'App\GraphQL\Location\Types\LocationListOrderType',
            'LocationList' => 'App\GraphQL\Location\Types\LocationListType',
            'LocationAddInput' => 'App\GraphQL\Location\Types\LocationAddInputType',
            'LocationUpdateInput' => 'App\GraphQL\Location\Types\LocationUpdateInputType',
        ];
    }

    static function getQueries()
    {
        return [
            'AllLocations' => 'App\GraphQL\Location\Queries\AllLocationsQuery',
            'LocationCount' => 'App\GraphQL\Location\Queries\LocationCountQuery',
            'OneLocation' => 'App\GraphQL\Location\Queries\OneLocationQuery',
        ];
    }

    static function getMutations()
    {
        return [
            'AddLocation' => 'App\GraphQL\Location\Mutations\AddLocationMutation',
            'RemoveLocation' => 'App\GraphQL\Location\Mutations\RemoveLocationMutation',
            'UpdateLocation' => 'App\GraphQL\Location\Mutations\UpdateLocationMutation',
        ];
    }

}
