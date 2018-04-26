<?php
// app/GraphQL/Interfaces/CharacterInterface.php
namespace App\GraphQL;

use GraphQL;
use Folklore\GraphQL\Support\InterfaceType;
use GraphQL\Type\Definition\Type;

class Beverage extends InterfaceType {
    
    protected $attributes = [
        'description' => 'Beverage interface.',
    ];

    public function fields() {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the Beverage.'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'Name of Beverage.'
            ],
        ];
    }

    public function resolveType($root) {
        // Use the resolveType to resolve the Type which is implemented trough this interface
        $type = $root['type'];
        if ($type === 'beer') {
            return GraphQL::type('Beer');
        } else if  ($type === 'cider') {
            return GraphQL::type('Cider');
        }
    }
}

//('App\\GraphQL\\Entities\\.*?\\.*?\\(.*?)(:?Type|Query|Mutation)')