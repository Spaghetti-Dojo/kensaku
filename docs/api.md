---
title: Api
layout: post
nav_order: 3
---

# Api

The `api` define a `fetch` function which is there to hide the WordPress Fetch API. The reason behind this decision lies on the fact that we might want to add middlewares to the request in the future or introducing some global data manipulation.

The package provide then the following functions to interact with the WordPress API:

## `searchEntities`

This function is a wrapper for the Search Endpoint of the WordPress API. It will return a `Set` of entities matching the search query.

The possible query arguments are specified by the `EntitiesSearch.QueryArguments` type, an interface you can expand to add more arguments.

This function is not directly consumed by the components, and it is not intended to be used internally. The idea is to follow the Tell don't Ask principle and let the consumer specify how to search the Entities.

Below a possible example of its usage related to a component:

```tsx
// my-component.tsx
type Search = EntitiesSearch.SearchEntitiesFunction<string, string>;
type Props = {
    search: Search
}

const MyComponent (props: Props) => {
    const [entities, setEntities] = useState<Set>(new Set());

    useEffect(() => {
        props
            .search(
                'my search phrase',
                'post',
                new Set(['page']),
                {
                    per_page: 10,
                    _fields: ['slug', 'title']
                }
            )
            .then(setEntities);
    }, []);

    // Do something with the entities
}

// index.tsx
import {searchEntities} from 'wp-entities-search';

root.render(<MyComponent search={searchEntities} />);
```

### Parameters

The function accept four parameters

- `type` - The root type. We have two built-int supported types `post`, `term`.
- `subtype` - The subtype of the entity. For example, if the `type` is `post`, the `subtype` can be `page`, `post`, etc. WordPress exclude automatically the `attachment` subtype.
- `phrase` - The search phrase. This becomes the `s` parameter for the Search Endpoint.
- `queryArguments` - All the supported and extra query arguments. The `EntitiesSearch.QueryArguments` type is an interface you can expand to add more arguments.

### Return

The function return an immutable `Set` of entities.

NOTE: The function does not handle possible request exceptions.

### Aborting Requests

The `searchEntities` will automatically abort the requests with the same parameters if a new request is made before the previous one is completed.

