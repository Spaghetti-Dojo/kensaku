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

    private const POST_TYPES = [
        [
            'name' => 'e2e-post-type',
            'configuration' => [
                'label' => 'E2E Post Type Example',
                'public' => true,
                'show_in_rest' => true,
                'supports' => ['title', 'editor', 'thumbnail'],
                'taxonomies' => ['category', 'post_tag'],
                'rewrite' => ['slug' => 'e2e-post-type-example'],
            ],
        ],
    ];

    public static function new(): self
    {
        return new self();
    }

    final private function __construct()
    {
    }

    /**
     * phpcs:disable Inpsyde.CodeQuality.NestingLevel.High
     */
    public function run(Container\ContainerInterface $container): bool
    {
        // phpcs:enable Inpsyde.CodeQuality.NestingLevel.High

        $env = \defined('WP_ENVIRONMENT_TYPE') ? WP_ENVIRONMENT_TYPE : '';
        if (!\in_array($env, ['development', 'local'], true)) {
            return false;
        }

        // TODO Add WpContext to avoid run if not the right context.

        \add_action('init', static function () use ($container) {
            /** @var Modularity\Properties\Properties $properties */
            $properties = $container->get(Modularity\Package::PROPERTIES);
            self::postTypesExample($properties);
        });

        \add_action('init', static function () {
            ['name' => $name, 'configuration' => $configuration] = self::POST_TYPES[0];
            for ($i = 1; $i < 5; $i++) {
                $mergedConfiguration = \array_merge(
                    $configuration,
                    [
                        'label' => "{$configuration['label']} $i",
                        'rewrite' => ['slug' => "{$configuration['rewrite']['slug']}-$i"],
                    ]
                );
                // phpcs:disable WordPress.NamingConventions.ValidPostTypeSlug.PartiallyDynamic
                \register_post_type("{$name}-$i", $mergedConfiguration);
            }
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

        \wp_register_script(
            'widoz-entities-search-e2e-taxonomies-example-block',
            "{$baseUrl}/sources/php/src/Modules/E2e/resources/js/taxonomies-example-block/index.js",
            ['widoz-entities-search', 'immutable'],
            '0.0.0',
            true,
        );

        \register_block_type_from_metadata(
            __DIR__ . '/resources/js/post-types-example-block/block.json',
        );

        \register_block_type_from_metadata(
            __DIR__ . '/resources/js/taxonomies-example-block/block.json',
        );
    }
}
