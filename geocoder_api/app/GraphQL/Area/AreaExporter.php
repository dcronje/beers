<?php
namespace App\GraphQL\Area;

use App\GraphQL\Exporter;

class AreaExporter implements Exporter {

    static function getTypes()
    {
        return [
            'Area' => 'App\GraphQL\Area\Types\AreaType',
            'AreaListDirectionEnum' => 'App\GraphQL\Area\Types\AreaListDirectionEnumType',
            'AreaListFilters' => 'App\GraphQL\Area\Types\AreaListFiltersType',
            'AreaListOrderEnum' => 'App\GraphQL\Area\Types\AreaListOrderEnumType',
            'AreaListOrder' => 'App\GraphQL\Area\Types\AreaListOrderType',
            'AreaList' => 'App\GraphQL\Area\Types\AreaListType',
            'AreaAddInput' => 'App\GraphQL\Area\Types\AreaAddInputType',
            'AreaUpdateInput' => 'App\GraphQL\Area\Types\AreaUpdateInputType',
        ];
    }

    static function getQueries()
    {
        return [
            'AllAreas' => 'App\GraphQL\Area\Queries\AllAreasQuery',
            'AreaCount' => 'App\GraphQL\Area\Queries\AreaCountQuery',
            'OneArea' => 'App\GraphQL\Area\Queries\OneAreaQuery',
        ];
    }

    static function getMutations()
    {
        return [
            'AddArea' => 'App\GraphQL\Area\Mutations\AddAreaMutation',
            'RemoveArea' => 'App\GraphQL\Area\Mutations\RemoveAreaMutation',
            'UpdateArea' => 'App\GraphQL\Area\Mutations\UpdateAreaMutation',
        ];
    }

}