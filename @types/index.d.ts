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
		readonly value?: V | undefined;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (value: PostTypeControl<V>['value']) => void;
		readonly className?: string;
	}

	interface PostsControl<V> {
		readonly value?: Set<V> | undefined;
		readonly options: Set<ControlOption<V>>;
		readonly onChange: (values: PostsControl<V>['value']) => void;
		readonly className?: string;
		readonly searchPosts?: (
			phrase: string
		) => Promise<PostsControl<V>['options']>;
	}

	interface CompositePostsPostTypes<P, T> {
		readonly posts: PostsControl<P>;
		readonly postType: PostTypeControl<T>;
		readonly searchPosts?: (
			phrase: string,
			postType: PostTypeControl<T>['value']
		) => Promise<PostsControl<P>['options']>;
		readonly children: (
			posts: CompositePostsPostTypes<P, T>['posts'],
			postType: CompositePostsPostTypes<P, T>['postType']
		) => React.ReactNode;
	}
}
