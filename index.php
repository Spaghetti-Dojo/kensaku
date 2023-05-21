<?php
declare(strict_types=1);

namespace Widoz\EntitiesSearch;

use Inpsyde\Modularity;

function package(): Modularity\Package
{
    static $package;

    function autoload(): void
    {
        $autoloadFile = __DIR__ . '/vendor/autoload.php';
        if (!\is_readable($autoloadFile)) {
            return;
        }
        require_once __DIR__ . '/vendor/autoload.php';
    }

    if (!$package) {
        autoload();
        $properties = Modularity\Properties\LibraryProperties::new(__DIR__ . '/composer.json');
        $package = Modularity\Package::new($properties);
        $package->boot();
    }

    return $package;
}
