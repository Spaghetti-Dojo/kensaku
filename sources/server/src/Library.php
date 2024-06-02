<?php

declare(strict_types=1);

namespace Widoz\Wp\EntitiesSearch;

use Inpsyde\Modularity;

class Library
{
    public static function new(string $baseUrl): Library
    {
        return new self($baseUrl);
    }

    final private function __construct(private string $baseUrl)
    {
    }

    /**
     * @throws \Exception
     */
    public function package(): Modularity\Package
    {
        $properties = Modularity\Properties\LibraryProperties::new(
            \dirname(__DIR__, 3) . '/composer.json',
            $this->baseUrl
        );

        return Modularity\Package::new($properties)
            ->addModule(Modules\Logging\Module::new())
            ->addModule(Modules\BlockEditor\Module::new());
    }
}
