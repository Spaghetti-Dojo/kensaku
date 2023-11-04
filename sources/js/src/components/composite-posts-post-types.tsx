import type EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { useState } from '@wordpress/element';

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

	const onChangePosts = (posts: Set<P> | null) => {
		setState({ ...state, posts });
		props.posts.onChange(posts);
	};

	const onChangePostType = (postType: T | null) => {
		setState({ ...state, postType, posts: Set([]) });
		props.postType.onChange(postType);
	};

	const searchPostsByPostType = async (phrase: string) => {
		if (!isUndefined(props.searchPosts)) {
			return props.searchPosts(phrase, state.postType).then((options) => {
				setPostsOptions(Set(options));
				return options;
			});
		}

		return Promise.reject('Invalid searchPosts function.');
	};

	const posts = {
		...props.posts,
		options: postsOptions,
		value: state.posts,
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

function isUndefined(value: any): value is undefined {
	return typeof value === 'undefined' || value === undefined;
}
