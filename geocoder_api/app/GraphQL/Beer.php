<?php
// app/GraphQL/Interfaces/CharacterInterface.php
namespace App\GraphQL;

use GraphQL;
use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL\Type\Definition\Type;

class Beer extends GraphQLType {

    protected $attributes = [
        'description' => 'Beer.',
    ];

    public function fields() {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the Beer.'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'Name of Beer.'
            ],
        ];
    }

    public function interfaces() {
      return [
        GraphQL::type('Beverage')
      ];
    }
    
}