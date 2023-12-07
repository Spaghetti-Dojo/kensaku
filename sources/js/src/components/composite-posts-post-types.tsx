import type EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

import { usePostsOptionsStorage } from '../hooks/use-posts-options-storage';
import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';
import { uniqueOrderedSet } from '../utils/unique-ordered-set';

export function CompositePostsPostTypes<P, T>(
	props: EntitiesSearch.CompositePostsPostTypes<P, T>
): JSX.Element {
	const { state, dispatch } = usePostsOptionsStorage<P>();
	const [searchPhrase, setSearchPhrase] = useState<string>('');
	const [valuesState, setValuesState] = useState({
		posts: props.posts.value,
		postType: props.postType.value,
	});

	useEffect(() => {
		searchPostsByPostType(
			'',
			valuesState.postType,
			valuesState.posts,
			true
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const searchPostsByPostType = async (
		phrase: string,
		postType: T,
		posts?: EntitiesSearch.PostsControl<P>['value'],
		first: boolean = false
	) => {
		if (phrase === '' && !first) {
			dispatch({
				type: 'UPDATE_POSTS_OPTIONS',
				postsOptions: state.initialPostsOptions,
			});
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

				if (first) {
					dispatch({
						type: 'UPDATE_SELECTED_POSTS_OPTIONS',
						posts: selectedOptions,
					});
					dispatch({
						type: 'SET_INITIAL_POSTS_OPTIONS',
						postsOptions: options,
					});
				}

				dispatch({
					type: 'UPDATE_POSTS_OPTIONS',
					postsOptions: options,
				});

				setSearchPhrase(phrase);

				return options;
			})
			.catch(() => {
				// TODO Add warning for user feedback.
				const emptySet = OrderedSet([]);
				dispatch({
					type: 'UPDATE_POSTS_OPTIONS',
					postsOptions: emptySet,
				});
				return emptySet;
			});
	};

	// TODO Add debouncing to the `search` callback
	const search: EntitiesSearch.Search<P>['search'] = (phraseOrEvent) => {
		const phrase =
			typeof phraseOrEvent === 'string'
				? phraseOrEvent
				: phraseOrEvent.target.value;

		searchPostsByPostType(phrase, valuesState.postType, valuesState.posts);
	};

	const onChangePosts = (posts: OrderedSet<P> | undefined) => {
		searchPostsByPostType(searchPhrase, valuesState.postType, posts);
		setValuesState({ ...valuesState, posts });
		dispatch({
			type: 'UPDATE_SELECTED_POSTS_OPTIONS',
			posts,
		});
		props.posts.onChange(posts);
	};

	const onChangePostType = (postType: T) => {
		searchPostsByPostType('', postType);
		setValuesState({ ...valuesState, postType, posts: OrderedSet([]) });
		props.postType.onChange(postType);
		props.posts.onChange(OrderedSet([]));
	};

	const posts: EntitiesSearch.PostsControl<P> = {
		...props.posts,
		value: valuesState.posts,
		options: orderSelectedOptionsAtTheTop<P>(
			uniqueOrderedSet(
				state.selectedPostsOptions.merge(state.postsOptions)
			),
			valuesState.posts
		),
		onChange: onChangePosts,
	};

	const postType: EntitiesSearch.PostTypeControl<T> = {
		...props.postType,
		value: valuesState.postType,
		onChange: onChangePostType,
	};

	return <>{props.children(posts, postType, search)}</>;
}
