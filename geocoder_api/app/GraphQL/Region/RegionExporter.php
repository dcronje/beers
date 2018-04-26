<?php
namespace App\GraphQL\Region;

use App\GraphQL\Exporter;

class RegionExporter implements Exporter {

    static function getTypes()
    {
        return [
            'Region' => 'App\GraphQL\Region\Types\RegionType',
            'RegionListDirectionEnum' => 'App\GraphQL\Region\Types\RegionListDirectionEnumType',
            'RegionListFilters' => 'App\GraphQL\Region\Types\RegionListFiltersType',
            'RegionListOrderEnum' => 'App\GraphQL\Region\Types\RegionListOrderEnumType',
            'RegionListOrder' => 'App\GraphQL\Region\Types\RegionListOrderType',
            'RegionList' => 'App\GraphQL\Region\Types\RegionListType',
            'RegionAddInput' => 'App\GraphQL\Region\Types\RegionAddInputType',
            'RegionUpdateInput' => 'App\GraphQL\Region\Types\RegionUpdateInputType',
        ];
    }

    static function getQueries()
    {
        return [
            'AllRegions' => 'App\GraphQL\Region\Queries\AllRegionsQuery',
            'RegionCount' => 'App\GraphQL\Region\Queries\RegionCountQuery',
            'OneRegion' => 'App\GraphQL\Region\Queries\OneRegionQuery',
        ];
    }

    static function getMutations()
    {
        return [
            'AddRegion' => 'App\GraphQL\Region\Mutations\AddRegionMutation',
            'RemoveRegion' => 'App\GraphQL\Region\Mutations\RemoveRegionMutation',
            'UpdateRegion' => 'App\GraphQL\Region\Mutations\UpdateRegionMutation',
        ];
    }

}