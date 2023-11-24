import type EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

import { isFunction } from '../utils/is-function';

export function CompositePostsPostTypes<P, T>(
	props: EntitiesSearch.CompositePostsPostTypes<P, T>
): JSX.Element {
	const [state, setState] = useState({
		posts: props.posts.value,
		postType: props.postType.value,
	});
	const [postsOptions, setPostsOptions] = useState<
		Set<EntitiesSearch.ControlOption<P>>
	>(Set([]));

	const onChangePosts = (posts: Set<P> | undefined) => {
		setState({ ...state, posts });
		props.posts.onChange(posts);
	};

	const onChangePostType = (postType: T) => {
		setState({ ...state, postType, posts: Set([]) });
		props.postType.onChange(postType);
		props.posts.onChange(Set([]));
	};

	const searchPostsByPostType = async (phrase: string) => {
		if (!isFunction(props.searchPosts)) {
			return Promise.resolve(Set([]));
		}

		return props
			.searchPosts(phrase, state.postType)
			.then((newOptions) => {
				const immutableOptions = Set(newOptions);
				setPostsOptions(immutableOptions);
				return immutableOptions;
			})
			.catch(() => {
				const emptySet = Set([]);
				setPostsOptions(emptySet);
				return emptySet;
			});
	};

	useEffect(() => {
		searchPostsByPostType('');
	}, [state.postType]);

	const posts: EntitiesSearch.PostsControl<P> = {
		...props.posts,
		value: state.posts,
		options: isFunction(props.searchPosts)
			? postsOptions
			: props.posts.options,
		onChange: onChangePosts,
	};

	const postType: EntitiesSearch.PostTypeControl<T> = {
		...props.postType,
		value: state.postType,
		onChange: onChangePostType,
	};

	return <>{props.children(posts, postType)}</>;
}
