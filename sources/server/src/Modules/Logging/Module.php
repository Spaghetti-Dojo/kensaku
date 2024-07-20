<?php

declare(strict_types=1);

namespace SpaghettiDojo\Kensaku\Modules\Logging;

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
            $properties = $container->get(Modularity\Package::PROPERTIES);

            $baseDir = \untrailingslashit($properties->basePath());
            $baseUrl = \untrailingslashit($properties->baseUrl());

            /**
             * @var array{dependencies?: array<string>, version?: string} $asset
             * @psalm-suppress UnresolvableInclude
             */
            $asset = (array)include "{$baseDir}/build/logging.asset.php";
            $dependencies = (array)($asset['dependencies'] ?? null);
            $version = (string)($asset['version'] ?? null) ?: false;

            \wp_register_script(
                'kensaku-logging',
                "{$baseUrl}/build/logging.js",
                $dependencies,
                $version,
                true
            );
        });

        return true;
    }
}
