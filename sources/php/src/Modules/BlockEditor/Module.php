<?php

declare(strict_types=1);

namespace Widoz\EntitiesSearch\Modules\BlockEditor;

use Inpsyde\Modularity;
use Psr\Container;

/**
 * @internal
 */
class Module implements Modularity\Module\ExecutableModule
{
    use Modularity\Module\ModuleClassNameIdTrait;

    public static function new(): Module
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function run(Container\ContainerInterface $c): bool
    {
        // TODO Add WpContext to avoid run if not the right context.

        \add_action('init', function () use ($c) {
            /** @var Modularity\Properties\Properties $properties */
            $properties = $c->get(Modularity\Package::PROPERTIES);

            $baseDir = \untrailingslashit($properties->basePath());
            $baseUrl = \untrailingslashit($properties->baseUrl());

            $asset = include "{$baseDir}/build/main.asset.php";
            $version = $properties->isDebug() ? $asset['version'] : $properties->version();

            \wp_register_script(
                'widoz-entities-search',
                "{$baseUrl}/build/main.js",
                $asset['dependencies'],
                $version
            );
        });

        return true;
    }
}
