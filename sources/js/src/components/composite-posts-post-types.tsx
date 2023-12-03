import type EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';
import { uniqueOrderedSet } from '../utils/unique-ordered-set';

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
	const [cachedPostsOptions, setCachedPostsOptions] = useState<
		OrderedSet<EntitiesSearch.ControlOption<P>>
	>(OrderedSet([]));
	const [firstPostsOptions, setFirstPostsOptions] = useState<
		OrderedSet<EntitiesSearch.ControlOption<P>>
	>(OrderedSet([]));
	const [selectedPostsOptions, setSelectedPostsOptions] = useState<
		OrderedSet<EntitiesSearch.ControlOption<P>>
	>(OrderedSet([]));

	useEffect(() => {
		searchPostsByPostType('', state.postType, state.posts, true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const searchPostsByPostType = async (
		phrase: string,
		postType: T,
		posts?: EntitiesSearch.PostsControl<P>['value'],
		first: boolean = false
	) => {
		if (phrase === '' && !first) {
			setPostsOptions(firstPostsOptions);
			return;
		}

		const promises: Array<
			ReturnType<
				EntitiesSearch.CompositePostsPostTypes<P, T>['searchPosts']
			>
		> = [
			props.searchPosts(phrase, postType, {
				exclude: posts,
			}),
		];

		if (first && (posts?.size ?? 0 > 0)) {
			promises.push(
				props.searchPosts('', postType, {
					include: posts,
					per_page: '-1',
				})
			);
		}

		Promise.all(promises)
			.then((result) => {
				const options = result[0] ?? OrderedSet();
				const selectedOptions = result[1] ?? OrderedSet();

				first && setSelectedPostsOptions(selectedOptions);
				first && setCachedPostsOptions(options);
				first && setFirstPostsOptions(options);

				setPostsOptions(options);
				setCachedPostsOptions(
					uniqueOrderedSet(
						cachedPostsOptions.merge(options).merge(selectedOptions)
					)
				);

				return options;
			})
			.catch(() => {
				// TODO Add warning for user feedback.
				const emptySet = OrderedSet([]);
				setPostsOptions(emptySet);
				return emptySet;
			});
	};

	// TODO Add debouncing to the `search` callback
	const search: EntitiesSearch.Search<P>['search'] = (phraseOrEvent) => {
		const phrase =
			typeof phraseOrEvent === 'string'
				? phraseOrEvent
				: phraseOrEvent.target.value;

		searchPostsByPostType(phrase, state.postType, state.posts);
	};

	const onChangePosts = (posts: OrderedSet<P> | undefined) => {
		setState({ ...state, posts });
		setSelectedPostsOptions(
			cachedPostsOptions.filter((option) => posts?.has(option.value))
		);
		props.posts.onChange(posts);
	};

	const onChangePostType = (postType: T) => {
		searchPostsByPostType('', postType);
		setState({ ...state, postType, posts: OrderedSet([]) });
		props.postType.onChange(postType);
		props.posts.onChange(OrderedSet([]));
	};

	const posts: EntitiesSearch.PostsControl<P> = {
		...props.posts,
		value: state.posts,
		options: orderSelectedOptionsAtTheTop<P>(
			uniqueOrderedSet(selectedPostsOptions.merge(postsOptions)),
			state.posts
		),
		onChange: onChangePosts,
	};

	const postType: EntitiesSearch.PostTypeControl<T> = {
		...props.postType,
		value: state.postType,
		onChange: onChangePostType,
	};

	return <>{props.children(posts, postType, search)}</>;
}
