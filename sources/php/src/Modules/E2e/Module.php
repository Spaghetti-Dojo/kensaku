<?php

declare(strict_types=1);

namespace Widoz\EntitiesSearch\Modules\E2e;

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

    public function run(Container\ContainerInterface $container): bool
    {
        // TODO Add WpContext to avoid run if not the right context.

        \add_action('init', static function () use ($container) {
            /** @var Modularity\Properties\Properties $properties */
            $properties = $container->get(Modularity\Package::PROPERTIES);

            self::postTypesExample($properties);
        });

        return true;
    }

    private static function postTypesExample(Modularity\Properties\Properties $properties): void
    {
        $baseUrl = \untrailingslashit($properties->baseUrl());

        // TODO: Immutable must be removed from being a dependency of the block.
        \wp_register_script(
            'immutable',
            "{$baseUrl}/node_modules/immutable/dist/immutable.min.js",
            [],
            '4.3.4',
            false
        );

        \wp_register_script(
            'widoz-entities-search-e2e-post-types-example-block',
            "{$baseUrl}/sources/php/src/Modules/E2e/resources/js/post-types-example-block/index.js",
            ['widoz-entities-search', 'immutable'],
            '0.0.0',
            true,
        );

        \register_block_type_from_metadata(
            __DIR__ . '/resources/js/post-types-example-block/block.json',
        );
    }
}
