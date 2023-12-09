import type { OrderedSet } from 'immutable';
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
		records(): OrderedSet<Entity>;
		isResolving(): boolean;
		errored(): boolean;
		succeed(): boolean;
	}>;

	/*
	 * Storage
	 */
	type PostsState<CO> = Readonly<{
		initialPostsOptions: OrderedSet<EntitiesSearch.ControlOption<CO>>;
		postsOptions: PostsState<CO>['initialPostsOptions'];
		selectedPostsOptions: PostsState<CO>['postsOptions'];
		cachedPostsOptions: PostsState<CO>['initialPostsOptions'];
	}>;

	type PostsAction<V> =
		| {
				type: 'UPDATE_POSTS_OPTIONS';
				postsOptions: PostsState<V>['postsOptions'];
		  }
		| {
				type: 'SET_INITIAL_POSTS_OPTIONS';
				postsOptions: PostsState<V>['initialPostsOptions'];
		  }
		| {
				type: 'UPDATE_SELECTED_POSTS_OPTIONS';
				posts:
					| OrderedSet<V>
					| PostsState<V>['selectedPostsOptions']
					| undefined;
		  };

	/*
	 * Components
	 */
	interface PostTypeControl<V>
		extends Readonly<{
			value: V;
			options: OrderedSet<ControlOption<V>>;
			className?: string;
			onChange(value: PostTypeControl<V>['value']): void;
		}> {}

	interface PostsControl<V>
		extends Readonly<{
			value?: OrderedSet<V> | undefined;
			options: OrderedSet<ControlOption<V>>;
			className?: string;
			onChange(values: PostsControl<V>['value']): void;
		}> {}

	interface Search
		extends Readonly<{
			id?: string;
			search(phrase: string | React.ChangeEvent<HTMLInputElement>);
		}> {}

	interface CompositePostsPostTypes<P, T>
		extends Readonly<{
			postType: PostTypeControl<T>;
			posts: Omit<PostsControl<P>, 'options'>;
			searchPosts: (
				phrase: string,
				postType: PostTypeControl<T>['value'],
				queryArguments?: Record<string, unknown>
			) => Promise<PostsControl<P>['options']>;
			children(
				posts: PostsControl<P>,
				postType: CompositePostsPostTypes<P, T>['postType'],
				search: (
					phrase: Parameters<Search<P, T>['search']>[0]
				) => ReturnType<Search<P, T>['search']>
			): React.ReactNode;
		}> {}
}
