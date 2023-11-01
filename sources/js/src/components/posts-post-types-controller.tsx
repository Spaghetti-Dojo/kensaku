import type EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { useState } from '@wordpress/element';

export function PostsPostTypesController<P, T>(
	props: EntitiesSearch.PostsPostTypesController<P, T>
): JSX.Element {
	const [state, setState] = useState({
		posts: props.posts.value,
		postType: props.postType.value,
	});

	const onChangePosts = (posts: Set<P> | null) => {
		setState({ ...state, posts });
		props.posts.onChange(posts);
	};

	const onChangePostType = (postType: T | null) => {
		setState({ ...state, postType });
		props.postType.onChange(postType);
	};

	const posts = {
		...props.posts,
		value: state.posts,
		onChange: onChangePosts,
	};

	const postType = {
		...props.postType,
		value: state.postType,
		onChange: onChangePostType,
	};

	return <>{props.children(posts, postType)}</>;
}
