---
title: Components
layout: post
nav_order: 2
---

# Components

The Wp Entities Search provides a set of components you can use to build your search UI.

We have to distinguish between two types of components:

- **Base Components**: These are the basic building blocks of the search UI. They are the smallest components and are
  used to build more complex components.
- **Composite Components**: These are more complex components that are built using the base ones.

The _Composite Component_ does not have a direct dependency on the _Base Components_, indeed a composite component
encapsulate the logic
that deal with the state management of the data and pass it down to the base components in form of properties via
the `children` function.

In a nutshell, a _Composite Component_ is configured from the external via props, dialog with the Rest API and pass the
data down to the _Base Components_.

## Base Components

- `PluralSelectControl` - A select control that allows multiple selections.
- `SingleSelectControl` - A select control that allows a single selection.
- `SearchControl` - An input control that allows the user to enter a search query.
- `ToggleControl` - A multi selection control that allows the user to toggle between multiple options.
- `RadioControl` - A single selection control that allows the user to select a single option.

## Composite Components

- `CompositeEntitiesByKind` - A composite component that displays a list of entities by kind. In this context _kind_
  is `post` or `term` and _entity_ is the entity type of the content e.g. a `page` or a `category` term.

## Composite Entities by Kind

The `CompositeEntitiesByKind` is a _generic_ component that can be used to display a list of entities by kind. It acts
as a controller that fetches the data from the Rest API using a given function and pass it down to one or more _Base
Components_.
It is up to you how to consume the data given to the children. Note, even if you consume just one part of the given
data,
the component will fetch all the data necessary to render the UI.

This component is intended to fulfill a scenario where the user is looking for some entities belonging to a certain
_kind_,
for instance, selecting the `page` _kind_ will return a list of the available pages and to filter the result further it
is
possible to use a search function in conjunction with a `search` field.

An example of its usage is:

```jsx
import { CompositeEntitiesByKind } from 'wp-entities-search';

export function MyComponent(props) {
    const entities = {
        value: new Set([13, 24, 55]),
        onChange: (value) => {
            // Do something with the selected entities
            // Notice, here you'll receive the value as a string Set.
        }
    };

    const kind = {
        value: new Set(['page']),
        options: [
            { label: 'Pages', value: 'page' },
            { label: 'Posts', value: 'post' },
        ],
        onChange={(value) => {
            // Do something with the selected kind
        }}
    };

    const searchEntities = async (phrase, kind, queryArguments) => convertEntitiesToControlOptions(
        await searchEntities('post', kind, phrase, queryArguments),
        'title',
        'id'
    );

    return <CompositeEntitiesByKind
        searchEntities={searchEntities}
        entities={entities}
        kind={kind}
    >
        {(entities, kind, search) => (
            <>
                <ToggleControl
                    value={kind.value}
                    options={kind.options}
                    onChange={kind.onChange}
                />
                <SearchControl
                    onChange={search.onChange}
                />
                <ToggleControl
                    value={entities.value}
                    onChange={entities.onChange}
                />
            </>
        )}
    </CompositeEntitiesByKind>;
}
```

In the example above we are passing a `searchEntities` function that will be used to fetch the entities from the Rest
API. This function is documented in the [api](./api.md) section.

What's important to know is that the `queryArguments` do not include the `_fields` property because it's not a concern
of the component decide which fields to retrieve, it's up to the consumer to decide which fields to retrieve. Anyhow,
you can still override the given configuration, but you have to be aware this might produce an incorrect result if not
done correctly. The component might pass arguments necessary to guarantee the consistency of the Set of the entities and
the kind.

In the following example we require `title` and `slug` fields to be retrieved from the Rest API.

```typescript
 async (phrase, kind, queryArguments) => {
    const fields = ['title', 'slug'];
    return convertEntitiesToControlOptions(
        await searchEntities('post', kind, phrase, {...queryArguments, fields}),
        ...fields
    )
 }
```

The `entities` and `kind` properties are the initial configuration, they'll change depending on what happen within the
respective `onChange` functions.

The `children` function will receive the `entities`, `kind` and `search` properties; notice the `search` is a function,
and it's up to the `SearchControl` to maintain the status of the value, the composite does hold the search value
internally, but it does not share it outside.

You're not forced to consume all the properties given to the `children`, you can remove the `SearchControl`
and let the user select only the retrieved entities. Moreover, you can also not have the Kind control at all and just
allow the search for one single kind.

In the example below we only allow to select the entities belonging to the `page` or `landing-page` kind not permitting
the user to switch between them.

```jsx
import { CompositeEntitiesByKind } from 'wp-entities-search';

export function MyComponent(props) {
    const entities = {
        value: new Set([13, 24, 55]),
        onChange: (value) => {
            // Do something with the selected entities
        }
    };

    const kind = {
        value: new Set(['page', 'landing-page']),
        options: Set([]),
        onChange={() => {}}
    };

    const searchEntities = async (phrase, kind, queryArguments) => convertEntitiesToControlOptions(
        await searchEntities('post', kind, phrase, queryArguments),
        'title',
        'id'
    );

    return <CompositeEntitiesByKind
        searchEntities={searchEntities}
        entities={entities}
        kind={kind}
    >
        {(entities, _, search) => (
            <>
                <SearchControl
                    onChange={search.onChange}
                />
                <ToggleControl
                    value={entities.value}
                    options={entities.options}
                    onChange={entities.onChange}
                />
            </>
        )}
    </CompositeEntitiesByKind>;
}
```

Obviously depending on what you want to achieve you can use different _Base Components_ or create new ones, as mentioned
above the package comes with a set of _Base Components_ that can be used out of the box.

## About Singular Base Components

The _Composite Component_ always give a collection of Entities and Kind even though you are consuming a Single* _Base
Component_.

The Singular Components always get a single value, therefore you have to consider to extract the first element out of
the `Set`.

```jsx
import { CompositeEntitiesByKind } from 'wp-entities-search';

export function MyComponent(props) {
    return <CompositeEntitiesByKind
        /* ... */
    >
        {(entities, kind, search) => (
            <>
                <RadioControl
                    value={kind.value.first()}
                    options={kind.options}
                    onChange={(value) => kind.onChange(new Set([value]))}
                />
                /* ... */
            </>
        )}
    </CompositeEntitiesByKind>;
}
```
