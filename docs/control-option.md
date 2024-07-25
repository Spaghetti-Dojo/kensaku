---
title: Control Option
layout: post
nav_order: 5
---

# Control Option

The `ControlOption` is the core Value Object of the project. It holds the information about the entities, and it
is carried around the business logic and the presentational layer.

The Control Option mainly contain the following properties:

- `label` (String): The label of the control option.
- `value` (mixed): The value of the control option.

An additional data structure is part of the `EnrichedControlOption` interface implemented by `ControlOption`. This DS is
not consumed within any of the _Base_ or _Composite_ components of the project, it is there to permit the third parties
to customize the UI.

The `extra` property is of type `Kensaku.Record`; it can hold a heterogeneous set of properties, we do not check
against values or types, this is up to the consumer.

## About the Value

The `value` is a generic type to give the possibility to customize the shape of the value since we allow the consumer to
implement they own components, and therefore we do not want to pose any restriction.

Nonetheless, the possible types the `value` can assume within the project Components is `string | number`;
see `Kensaku.Value` type for more info.

## How to use the Extra Property

Let's say you're using the `CompositeEntitiesByKind` component, and you want to render along with the Title of the
entity the `type` and the `excerpt`.

In the example below we're using the `extra` property to carry the `type` and the `excerpt` of the entity.

The `convertEntitiesToContrlOptions` will create the `ControlOption` with the `extra` property containing the post type
and the post excerpt.

```typescript
searchEntities: async (
	phrase,
	postType,
	queryArguments
) => {
	const postsEntities = await searchEntities(
		'post',
		postType,
		phrase,
		{...queryArguments, fields: ['title', 'id', 'type', 'excerpt']}
	);

	return convertEntitiesToControlOptions(
		postsEntities,
		'title',
		'id',

		// Extra properties
		'type',
		'excerpt'
	);
}
```

Then you can access the extra properties within your component since the `CompositeEntitiesByKind` will pass
the `entities` of type `Kensaku.BaseControl< E >` to the children.

```jsx
(entities: Kensaku.BaseControl< E >) => {
    return <MyComponent {...entities} />;
}
```

And internally of your `MyComponent` you can access the `extra` property of the `ControlOption`:

```jsx
function MyComponent(entities: Options<V>): JSX.Element {
    return (
        <div>
            {entities.options.map((option) => (
                <label>
                    <input value={option.value} />
                    <span>{option.label}</span>
                    <span>
                        <span>{option.extra.get('type')}</span>
                        <span>{option.extra.get('excerpt')}</span>
                    </span>
                </label>
            ))}
        </div>
    );
}
```
