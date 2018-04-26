<?php
namespace App\GraphQL\Country;

use App\GraphQL\Exporter;

class CountryExporter implements Exporter {

    static function getTypes()
    {
        return [
            'Country' => 'App\GraphQL\Country\Types\CountryType',
            'CountryListDirectionEnum' => 'App\GraphQL\Country\Types\CountryListDirectionEnumType',
            'CountryListFilters' => 'App\GraphQL\Country\Types\CountryListFiltersType',
            'CountryListOrderEnum' => 'App\GraphQL\Country\Types\CountryListOrderEnumType',
            'CountryListOrder' => 'App\GraphQL\Country\Types\CountryListOrderType',
            'CountryList' => 'App\GraphQL\Country\Types\CountryListType',
            'CountryAddInput' => 'App\GraphQL\Country\Types\CountryAddInputType',
            'CountryUpdateInput' => 'App\GraphQL\Country\Types\CountryUpdateInputType',
        ];
    }

    static function getQueries()
    {
        return [
            'AllCountries' => 'App\GraphQL\Country\Queries\AllCountriesQuery',
            'CountryCount' => 'App\GraphQL\Country\Queries\CountryCountQuery',
            'OneCountry' => 'App\GraphQL\Country\Queries\OneCountryQuery',
        ];
    }

    static function getMutations()
    {
        return [
            'AddCountry' => 'App\GraphQL\Country\Mutations\AddCountryMutation',
            'RemoveCountry' => 'App\GraphQL\Country\Mutations\RemoveCountryMutation',
            'UpdateCountry' => 'App\GraphQL\Country\Mutations\UpdateCountryMutation',
        ];
    }

}