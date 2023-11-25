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
		searchPostsByPostType('', postType, state.posts);
		setState({ ...state, postType, posts: OrderedSet([]) });
		props.postType.onChange(postType);
		props.posts.onChange(OrderedSet([]));
	};

	const searchPostsByPostType = async (
		phrase: string,
		postType: T,
		posts?: EntitiesSearch.PostsControl<P>['value']
	) => {
		const selectedOptions = posts?.toArray() ?? [];

		const promises: Array<
			ReturnType<
				EntitiesSearch.CompositePostsPostTypes<P, T>['searchPosts']
			>
		> = [
			props.searchPosts(phrase, postType, {
				exclude: selectedOptions,
			}),
		];

		if (selectedOptions.length > 0) {
			promises.push(
				props.searchPosts('', postType, {
					include: selectedOptions,
					per_page: '-1',
				})
			);
		}

		Promise.all(promises)
			.then((result) => {
				const options = result[0] ?? OrderedSet();
				const selectedOptions = result[1] ?? OrderedSet();
				setPostsOptions(options.merge(selectedOptions));
				return options;
			})
			.catch(() => {
				const emptySet = OrderedSet([]);
				setPostsOptions(emptySet);
				return emptySet;
			});
	};

	useEffect(() => {
		searchPostsByPostType('', state.postType, state.posts);
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
	const search: EntitiesSearch.Search<P>['search'] = (phraseOrEvent) => {
		const phrase =
			typeof phraseOrEvent === 'string'
				? phraseOrEvent
				: phraseOrEvent.target.value;

		/*
		 * Not performing the search when the phrase is empty help us in keeping the state, so that it's not necessary
		 * to do another rest call to retrieve the selected option.
		 */
		phrase && searchPostsByPostType(phrase, state.postType);
	};

	return <>{props.children(posts, postType, search)}</>;
}
