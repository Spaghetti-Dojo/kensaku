<?php

declare(strict_types=1);

namespace SpaghettiDojo\Wp\EntitiesSearch\Modules\BlockEditor;

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
            $properties = $container->get(Modularity\Package::PROPERTIES);

            $baseDir = \untrailingslashit($properties->basePath());
            $baseUrl = \untrailingslashit($properties->baseUrl());

            /**
             * @var array{dependencies?: array<string>, version?: string} $asset
             * @psalm-suppress UnresolvableInclude
             */
            $asset = (array)include "{$baseDir}/build/main.asset.php";
            $dependencies = (array)($asset['dependencies'] ?? null);
            self::isInDebugMode() and $dependencies[] = 'wp-entities-search-logging';
            $version = (string)($asset['version'] ?? null) ?: false;

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
