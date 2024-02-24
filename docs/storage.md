---
title: Storage
layout: post
nav_order: 8
---

You won't interact directly with the store but as mentioned in [hooks](./hooks.md), you can use the `useEntitiesOptionsStorage`.

The hook return the `state` and the `dispatch` but you have to configure it first.

The storage is not directly accessible because the intent of the project is to provide high level components that act as a bridge
between the configuration you need to provide and the components you want to use. Hence, it does not make sense to expose the storage api directly.

There are circumstances where you want to create your own high level component, and you need to use the storage.
In that case, you can use the `useEntitiesOptionsStorage` hook.

For more information please read the [component](./components.md) section, or, alternatively have a look at the
[CompositeEntitiesByKind](../sources/client/src/components/composite-entities-by-kind.tsx) component.

