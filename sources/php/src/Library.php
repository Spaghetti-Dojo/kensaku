<?php

declare(strict_types=1);

namespace Widoz\EntitiesSearch;

use Inpsyde\Modularity;

class Library
{
    public static function new(): Library
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public static function package(): Modularity\Package
    {
        $properties = Modularity\Properties\LibraryProperties::new(
            \dirname(__DIR__, 3) . '/composer.json'
        );

        return Modularity\Package::new($properties);
    }
}
