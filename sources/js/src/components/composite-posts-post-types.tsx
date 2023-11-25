import type EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

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
		searchPostsByPostType('', postType);
		setState({ ...state, postType, posts: Set([]) });
		props.postType.onChange(postType);
		props.posts.onChange(Set([]));
	};

	const searchPostsByPostType = async (phrase: string, postType: T) => {
		return props
			.searchPosts(phrase, postType)
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
		searchPostsByPostType('', state.postType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const posts: EntitiesSearch.PostsControl<P> = {
		...props.posts,
		value: state.posts,
		options: postsOptions,
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
