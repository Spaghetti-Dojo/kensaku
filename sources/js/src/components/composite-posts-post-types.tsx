import type EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect, useCallback } from '@wordpress/element';

import { isUndefined } from '../utils/is-undefined';

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

	const onChangePostType = (postType: T | undefined) => {
		setState({ ...state, postType, posts: Set([]) });
		props.postType.onChange(postType);
	};

	const searchPostsByPostType = useCallback(
		async (phrase: string) => {
			if (isUndefined(props.searchPosts)) {
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
					return Set(emptySet);
				});
		},
		[props.searchPosts, state.postType]
	);

	useEffect(() => {
		searchPostsByPostType('');
	}, [searchPostsByPostType]);

	const posts = {
		...props.posts,
		value: state.posts,
		options: postsOptions.size > 0 ? postsOptions : props.posts.options,
		onChange: onChangePosts,
		searchPosts: searchPostsByPostType,
	};

	const postType = {
		...props.postType,
		value: state.postType,
		onChange: onChangePostType,
	};

	return <>{props.children(posts, postType)}</>;
}
