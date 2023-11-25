import type EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';

export function CompositePostsPostTypes<P, T>(
	props: EntitiesSearch.CompositePostsPostTypes<P, T>
): JSX.Element {
	const [state, setState] = useState({
		posts: props.posts.value,
		postType: props.postType.value,
	});
	const [postsOptions, setPostsOptions] = useState<
		OrderedSet<EntitiesSearch.ControlOption<P>>
	>(OrderedSet([]));

	const onChangePosts = (posts: OrderedSet<P> | undefined) => {
		setState({ ...state, posts });
		props.posts.onChange(posts);
	};

	const onChangePostType = (postType: T) => {
		searchPostsByPostType('', postType);
		setState({ ...state, postType, posts: OrderedSet([]) });
		props.postType.onChange(postType);
		props.posts.onChange(OrderedSet([]));
	};

	const searchPostsByPostType = async (phrase: string, postType: T) => {
		return props
			.searchPosts(phrase, postType)
			.then((newOptions) => {
				const immutableOptions = OrderedSet(newOptions);
				setPostsOptions(immutableOptions);
				return immutableOptions;
			})
			.catch(() => {
				const emptySet = OrderedSet([]);
				setPostsOptions(emptySet);
				return emptySet;
			});
	};

	useEffect(() => {
		searchPostsByPostType('', state.postType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const posts: EntitiesSearch.PostsControl<P> = {
		...props.posts,
		value: state.posts,
		options: orderSelectedOptionsAtTheTop<P>(postsOptions, state.posts),
		onChange: onChangePosts,
	};

	const postType: EntitiesSearch.PostTypeControl<T> = {
		...props.postType,
		value: state.postType,
		onChange: onChangePostType,
	};

	// TODO Add debouncing to the `search` callback
	const search: EntitiesSearch.Search<P>['search'] = (phrase) =>
		searchPostsByPostType(
			typeof phrase === 'string' ? phrase : phrase.target.value,
			state.postType
		);

	return <>{props.children(posts, postType, search)}</>;
}
