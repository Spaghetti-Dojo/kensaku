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

    public function run(Container\ContainerInterface $c): bool
    {
        // TODO Add WpContext to avoid run if not the right context.

        \add_action('init', function () use ($c) {
            /** @var Modularity\Properties\Properties $properties */
            $properties = $c->get(Modularity\Package::PROPERTIES);

            self::postTypesExample($properties);
        });

        return true;
    }

    private static function postTypesExample(Modularity\Properties\Properties $properties): void
    {
        $baseUrl = \untrailingslashit($properties->baseUrl());

        \wp_register_script(
            'widoz-entities-search-e2e-post-types-example-block',
            "{$baseUrl}/sources/php/src/Modules/E2e/resources/js/post-types-example-block/index.js",
            ['widoz-entities-search'],
            '0.0.0'
        );

        \register_block_type_from_metadata(
            __DIR__ . '/resources/js/post-types-example-block/block.json',
        );
    }
}
