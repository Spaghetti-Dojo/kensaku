<?php
/**
 * Plugin Name: Entities Search
 * Author: Guido Scialfa
 * Author URI: https://guidoscialfa.com/
 */

declare(strict_types=1);

use Inpsyde\Modularity;
use Widoz\EntitiesSearch;

function package(): Modularity\Package
{
    static $package;

    $projectRoot = __DIR__;

    function autoload(string $projectRoot): void
    {
        $autoloadFile = "{$projectRoot}/vendor/autoload.php";
        if (!\is_readable($autoloadFile)) {
            return;
        }
        require_once $autoloadFile;
    }

    if (!$package) {
        autoload($projectRoot);
        $package = EntitiesSearch\Library::new(\plugin_dir_url(__FILE__))->package();
    }

    return $package;
}

\add_action(
    'plugins_loaded',
    fn() => package()
        ->addModule(Widoz\EntitiesSearch\Modules\E2e\Module::new())
        ->boot()
);
