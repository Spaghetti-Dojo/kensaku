<?php

declare(strict_types=1);

namespace Widoz\EntitiesSearch;

use Inpsyde\Modularity;
use Widoz\EntitiesSearch\Modules;

class Library
{
    public static function new(string $baseUrl = null): Library
    {
        return new self($baseUrl);
    }

    final private function __construct(private string $baseUrl)
    {
    }

    public function package(): Modularity\Package
    {
        $properties = Modularity\Properties\LibraryProperties::new(
            \dirname(__DIR__, 3) . '/composer.json',
            $this->baseUrl
        );

        return Modularity\Package::new($properties)
            ->addModule(Modules\BlockEditor\Module::new());
    }
}
