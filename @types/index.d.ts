import type { Set } from 'immutable';
import React, { ComponentType } from 'react';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

type ComponentStateAware<V> = {
	value: Set<V>;
	setValue(value: ComponentStateAware['value']): void;
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

	type EntitiesRecords<Entity> = Readonly<{
		records(): Set<Entity>;
		isResolving(): boolean;
		errored(): boolean;
		succeed(): boolean;
	}>;

	/**
	 * Components
	 */
	// TODO Check the ControlOption because it might not be a good idea to hide it inside the type.
	interface PostTypeSelect<V> {
		readonly value: ControlOption<V>;
		readonly options: Set<PostTypeSelect['value']>;
		readonly onChange: (value: PostTypeSelect['value'] | null) => void;
	}

	// TODO Check the ControlOption because it might not be a good idea to hide it inside the type.
	interface PostsSelect<V> {
		readonly values: Array<ControlOption<V>>;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (values: PostsSelect['value'] | null) => void;
	}

	interface PostsController<P, T> {
		readonly postsComponent: React.ComponentType<ComponentStateAware<P>>;
		readonly typesComponent: React.ComponentType<ComponentStateAware<T>>;
	}
}
