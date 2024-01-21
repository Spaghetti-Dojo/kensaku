<?php

declare(strict_types=1);

namespace Widoz\Wp\EntitiesSearch\Modules\BlockEditor;

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
        \add_action('init', static function () use ($container) {
          /** @var Modularity\Properties\Properties $properties */
            $properties = $container->get(Modularity\Package::PROPERTIES);

            $baseDir = \untrailingslashit($properties->basePath());
            $baseUrl = \untrailingslashit($properties->baseUrl());

            $asset = include "{$baseDir}/build/main.asset.php";
            $version = $properties->isDebug() ? $asset['version'] : $properties->version();
            $dependencies = $asset['dependencies'];
            self::isInDebugMode() and $dependencies[] = 'wp-entities-search-logging';

            \wp_register_script(
                'wp-entities-search',
                "{$baseUrl}/build/main.js",
                $dependencies,
                $version,
                true
            );
        });

        return true;
    }

    private static function isInDebugMode(): bool
    {
        return \defined('WP_DEBUG') && WP_DEBUG;
    }
}
