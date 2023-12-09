import type EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

import { usePostsOptionsStorage } from '../hooks/use-posts-options-storage';
import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';
import { uniqueOrderedSet } from '../utils/unique-ordered-set';

type SearchPhrase = Parameters<EntitiesSearch.Search['search']>[0];
type PostType<V> = EntitiesSearch.PostTypeControl<V>['value'];
type Posts<V> = EntitiesSearch.PostsControl<V>['value'];
type SearchPosts<P, T> = EntitiesSearch.CompositePostsPostTypes<
	P,
	T
>['searchPosts'];

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
		phraseOrEvent: SearchPhrase,
		postType: PostType<T>,
		posts?: Posts<P>,
		firstOptionsLoad: boolean = false
	) => {
		const phrase =
			typeof phraseOrEvent === 'string'
				? phraseOrEvent
				: phraseOrEvent.target.value;

		/*
		 * This is a cleanup, the user has deleted the search phrase, and we render the original options.s
		 */
		if (phrase === '' && !firstOptionsLoad) {
			dispatch({
				type: 'UPDATE_POSTS_OPTIONS',
				postsOptions: state.initialPostsOptions,
			});
			return;
		}

		/*
		 * Collect the options based on the search phrase and the post type.
		 */
		const promises: Array<ReturnType<SearchPosts<P, T>>> = [
			props.searchPosts(phrase, postType, {
				exclude: posts,
			}),
		];

		/*
		 * Includes the selected options if it is the first search.
		 * We do want to include the selected options during the first load.
		 */
		if (firstOptionsLoad && (posts?.size ?? 0 > 0)) {
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

				/*
				 * Related to the first load, we need to update the selected options and the initial options.
				 */
				if (firstOptionsLoad) {
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

	const onChangePosts = (posts: Posts<P>) => {
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

	return (
		<>
			{props.children(
				posts,
				postType,
				// TODO Add debouncing to the `search` callback
				(phrase: SearchPhrase) =>
					searchPostsByPostType(
						phrase,
						valuesState.postType,
						valuesState.posts
					)
			)}
		</>
	);
}
