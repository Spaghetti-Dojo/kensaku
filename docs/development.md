---
title: Development
layout: post
nav_order: 2
---

# Development

The first thing to do is to clone the repository and install the dependencies:

```bash
$ git clone git@github.com:widoz/wp-entities-search.git
$ cd wp-entities-search
$ composer install
$ yarn install
```

After we have installed the dependencies we need to build the assets:

```bash
$ yarn build
```

or alternatively we can run the dev script to compile the assets with source maps:

```bash
$ yarn build:dev
```

## The Environment

The project is making use of `@wordress/env` as a local environment to develop the solution.

To start the environment we need to run the following command:

```bash
$ yarn wp-env start
```

This will install WordPress and will set the current project as a plugin. The package contain a E2E module used by the plugin to help with the development. The module register two blocks; one for the Custom Post Type and one for the Custom Taxonomy.

The WordPress installation is provided without content. To add some we can run the following commands from the root of the project:

```bash
./scripts/create-posts.sh --num 20 --title Post --type post
./scripts/create-posts.sh --num 20 --title Page --type page
./scripts/create-terms.sh --num 20 --name Category --taxonomy category
./scripts/create-terms.sh --num 20 --name Tag --taxonomy post_tag
```

## Basic Concepts

The package implement a Value Object to handle immutability called `Set`. This is the main implementation used by the package to work with external data. Whenever a data is fetched from the WordPress API it will be wrapped in a `Set` object, but also all components and functions deal with this implementation. In a summary, every data entering the package will be wrapped in a `Set` object.

Another commonly used data structure is the `ControlOption` which is not directly consumed but define the type of the `Set`. It should not be consumed directly but through the `Set` api.

## Usage Examples

As mentioned above the package have a E2E module which register two blocks to test the functionality. The first block is a Custom Post Type and the second one is a Custom Taxonomy. The two blocks are using the same component to render the results, you can get some insight about the usage from them.
