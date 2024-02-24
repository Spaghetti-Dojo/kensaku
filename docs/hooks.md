---
title: Hooks
layout: post
nav_order: 5
---

# Hooks

The Wp Entities Search expose some hooks to help you to work with the search and the rest calls.

- `useEntitiesOptionsStorage`
- `useEntitiesRecords`
- `useQueryViewablePostTypes`
- `useQueryViewableTaxonomies`
- `useSearch`

## `useEntitiesOptionsStorage`

This hook is used to initialize the option's storage. It gets passed a partial `initialState` and the `searchEntities`
function.

The partial `initialState` includes the initial values for the `entities` and the `kind`. The `searchEntities` function
is used to search for the entities and store the results in the state.

The returned value is the readonly `state` and the `dispatch` function to update it.

```jsx
const [state, dispatch] = useEntitiesOptionsStorage<E, K>(
    {
        entities: props.entities, // Set([12, 43, 112])
        kind: props.kind, // Set(['page'])
    },
    props.searchEntities
);
```

## `useEntitiesRecords`

This hook represent the main api to get the entities records from the server.

This is different from the search api in the sense that, the search api is used to search for the entities belonging
to one or more kinds by a phrase. The records api is used to retrieve the entities belonging to a specific kind. Both
solutions
customize the query by additional arguments.

In the future the two api might be merged into one.

The current situation is due the fact the `useEntityRecords` does not allow more than one `kind` and the `useSearch` is
not
capable of retrieving the entities **kinds**.

This hook is a decorator of the WordPress `useEntityRecords` hook, and it augment the original hook with some methods
for an easy consumption.

- `records()` - The records of the entities.
- `isResolving()` - A boolean to check if the records are resolving.
- `errored()` - A boolean to check if the request failed.
- `succeed()` - A boolean to check if the request succeed.

Regarding the parameters, along with the `kind` and the `name` (entity name) it accept additional arguments to
customize the query. The accepted arguments are the same arguments accepted by the respective WordPress Rest API
endpoint.

The following example is retrieving the list of the `postType`s from the server.

```ts
const entitiesRecords = useEntityRecords<EntitiesSearch.PostType<'edit'>>(
    'root',
    'postType',
    { per_page: -1 }
);
```

Even if publicly available this hook is not intended to be consumed from within any component. Instead, it meant to be
used by other hooks to return a specific set of entities based on their configuration.

## `useQueryViewablePostTypes`

This hook is a subset of the `useEntitiesRecords` hook. It is used to retrieve the list of the viewable post types.

## `useQueryViewableTaxonomies`

This hook is a subset of the `useEntitiesRecords` hook. It is used to retrieve the list of the viewable taxonomies.
Differently than the post types the taxonomies does not have a `viewable` property, in this case we query
the `visibility.publicly_queryable` prop.

## `useSearch`

This hook will return a throttled function to search for the entities. In-fact it's more a _factory hook_. The returned
function get one single parameter the `phrase`. This is convenient because we do not have to pass multiple props down
the components three or use a context / state.

It requires a function `searchEntities` to perform the search to the server, the `kind` and `entities` to correctly
query for the new entities values. In the future there'll be the possibility to reuse the storage directly from within
the hook reducing the amount of parameters, and for last the `dispatch`, necessary to update the shared state.

When the state update fail for any reason an action `wp-entities-search.on-search.error` is fired. You can hook into it
and consume the given `error` instance. More on this in the [logging](./logging.md) documentation.
