import type { Set } from 'immutable';
import React, { PropsWithChildren } from 'react';

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
			value: V;
			options: Set<ControlOption<V>>;
			className?: string;
			onChange(value: PostTypeControl<V>['value']): void;
		}> {}

	interface PostsControl<V>
		extends Readonly<{
			value?: Set<V> | undefined;
			options: Set<ControlOption<V>>;
			className?: string;
			onChange(values: PostsControl<V>['value']): void;
		}> {}

	interface Search<V>
		extends Readonly<{
			id?: string;
			search(
				phrase: string | React.ChangeEvent<HTMLInputElement>
			): Promise<Set<ControlOption<V>>>;
		}> {}

	interface CompositePostsPostTypes<P, T>
		extends Readonly<{
			postType: PostTypeControl<T>;
			posts: PostsControl<P>;
			searchPosts: (
				phrase: string,
				postType: PostTypeControl<T>['value']
			) => Promise<PostsControl<P>['options']>;
			children(
				posts: CompositePostsPostTypes<P, T>['posts'],
				postType: CompositePostsPostTypes<P, T>['postType'],
				search: Search<P>['search']
			): React.ReactNode;
		}> {}
}
