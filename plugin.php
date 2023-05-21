<?php
/**
 * Plugin Name: Entities Search
 * Author: Guido Scialfa
 * Author URI: https://guidoscialfa.com/
 */

/*
 * <WARNING>
 * This plugin is intended for local development only as the composer package type is set to `library`.
 */

declare(strict_types=1);

use Widoz\EntitiesSearch;

require_once __DIR__ . '/index.php';
\add_action('plugins_loaded', static fn() => EntitiesSearch\package());
