<?php

declare(strict_types=1);

namespace Widoz\Wp\EntitiesSearch\Modules\Logging;

use Inpsyde\Modularity;
use Psr\Container;

/**
 * @internal
 */
class Module implements Modularity\Module\ExecutableModule
{
    use Modularity\Module\ModuleClassNameIdTrait;

    public static function new(): self
    {
        return new self();
    }

    final private function __construct()
    {
    }

    public function run(Container\ContainerInterface $container): bool
    {
        if (!$container->get(Modularity\Package::PROPERTIES)->isDebug()) {
            return false;
        }

        \add_action('init', static function () use ($container) {
            /** @var Modularity\Properties\Properties $properties */
            $properties = $container->get(Modularity\Package::PROPERTIES);

            $baseDir = \untrailingslashit($properties->basePath());
            $baseUrl = \untrailingslashit($properties->baseUrl());
            $asset = include "{$baseDir}/build/logging.asset.php";
            $version = $properties->isDebug() ? $asset['version'] : $properties->version();

            \wp_register_script(
                'wp-entities-search-logging',
                "{$baseUrl}/build/logging.js",
                $asset['dependencies'],
                $version,
                true
            );
        });

        return true;
    }
}
