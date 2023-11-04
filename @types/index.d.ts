import type { Set } from 'immutable';
import React from 'react';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

export default EntitiesSearch;

declare namespace EntitiesSearch {
	type Post<C extends Context = 'view'> = BaseEntityRecords.Post<C>;
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
	interface PostTypeControl<V> {
		readonly value: V | null;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (value: PostTypeControl<V>['value']) => void;
	}

	interface PostsControl<V, T> {
		readonly value: Set<V> | null;
		// TODO See if it's possible to reuse PostTypeControl<V>['value'] here.
		readonly postType: string;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (values: PostsControl<V>['value']) => void;
	}

	interface PostsPostTypesController<P, T> {
		posts: PostsControl<P>;
		postType: PostTypeControl<T>;
		children: (
			posts: PostsPostTypesController<P, T>['posts'],
			postType: PostsPostTypesController<P, T>['postType']
		) => React.ReactNode;
	}
}
