import type { Set } from 'immutable';
import React from 'react';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

type ComponentStateAware<V> = {
	value: Set<V>;
	setValue(value: ComponentStateAware<V>['value']): void;
};

export default EntitiesSearch;

declare namespace EntitiesSearch {
	type PostType<C extends Context = 'view'> = BaseEntityRecords.Type<C>;

	type ViewablePostType = Readonly<{
		[K in keyof PostType<'edit'>]: K extends 'viewable'
			? true
			: PostType<'edit'>[K];
	}>;

	type ControlOption<V extends any> = Readonly<{
		value: V;
		label: string;
	}>;

	type ComponentStateAware<V> = {
		value: V;
		setValue(value: ComponentStateAware['value']): void;
	};

	type EntitiesRecords<Entity> = Readonly<{
		records(): Set<Entity>;
		isResolving(): boolean;
		errored(): boolean;
		succeed(): boolean;
	}>;

	/**
	 * Components
	 */
	interface PostTypeSelect<V> {
		readonly value: V | null;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (value: PostTypeSelect<V>['value']) => void;
	}

	interface PostsSelect<V> {
		readonly value: Set<V> | null;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (values: PostsSelect<V>['value']) => void;
	}

	interface PostsController<P, T> {
		readonly postsComponent: React.ComponentType<
			ComponentStateAware<Set<P>>
		>;
		readonly typesComponent: React.ComponentType<ComponentStateAware<T>>;
	}
}
