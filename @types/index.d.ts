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
	interface PostTypeControl<V>
		extends Readonly<{
			value?: V | undefined;
			options: Set<ControlOption<V>>;
			onChange: (value: PostTypeControl<V>['value']) => void;
			className?: string;
		}> {}

	interface PostsControl<V>
		extends Readonly<{
			value?: Set<V> | undefined;
			options: Set<ControlOption<V>>;
			onChange: (values: PostsControl<V>['value']) => void;
			className?: string;
		}> {}

	interface CompositePostsPostTypes<P, T>
		extends Readonly<{
			postType: PostTypeControl<T>;
			// TODO When the `searchPosts` are given, the `posts` shouldn't get passed the `options` prop.
			posts: PostsControl<P>;
			searchPosts?: (
				phrase: string,
				postType: PostTypeControl<T>['value']
			) => Promise<PostsControl<P>['options']>;
			children: (
				posts: CompositePostsPostTypes<P, T>['posts'],
				postType: CompositePostsPostTypes<P, T>['postType']
			) => React.ReactNode;
		}> {}
}
