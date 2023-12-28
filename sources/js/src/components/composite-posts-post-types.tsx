import type EntitiesSearch from '@types';
import { OrderedSet, Set } from 'immutable';
import React, { JSX } from 'react';

import { useState, useEffect } from '@wordpress/element';

import { usePostsOptionsStorage } from '../hooks/use-posts-options-storage';
import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';
import { uniqueControlOptions } from '../utils/unique-control-options';

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
	const [searchPhrase, setSearchPhrase] = useState('');
	const [valuesState, setValuesState] = useState({
		posts: props.posts.value ?? OrderedSet([]),
		postType: props.postType.value,
	});

	useEffect(() => {
		let promises = Set<ReturnType<SearchPosts<P, T>>>().asMutable();

		promises.add(
			props.searchPosts('', valuesState.postType, {
				exclude: valuesState.posts,
			})
		);

		if (valuesState.posts.size > 0) {
			promises.add(
				props.searchPosts('', valuesState.postType, {
					include: valuesState.posts,
					per_page: '-1',
				})
			);
		}

		Promise.all(promises).then((result) => {
			const postsOptions = result[0] ?? OrderedSet([]);
			const selectedPostsOptions = result[1] ?? OrderedSet([]);

			dispatch({
				type: 'UPDATE_SELECTED_POSTS_OPTIONS',
				selectedPostsOptions,
			});
			dispatch({
				type: 'UPDATE_CONTEXUAL_POSTS_OPTIONS',
				contextualPostsOptions: postsOptions,
			});
			dispatch({
				type: 'UPDATE_POSTS_OPTIONS',
				postsOptions,
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const searchPostsByPostType = async (
		phrase: string,
		postType: PostType<T>
	) => {
		if (!phrase) {
			return;
		}

		props
			.searchPosts(phrase, postType, {
				exclude: valuesState.posts,
			})
			.then((result) =>
				dispatch({
					type: 'UPDATE_POSTS_OPTIONS',
					postsOptions: result,
				})
			)
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
		// TODO It is the state still necessary having the reducer?
		setValuesState({ ...valuesState, posts: posts ?? OrderedSet([]) });
		props.posts.onChange(posts);

		if ((posts?.size ?? 0) <= 0) {
			dispatch({
				type: 'UPDATE_SELECTED_POSTS_OPTIONS',
				selectedPostsOptions: OrderedSet([]),
			});
			dispatch({
				type: 'UPDATE_POSTS_OPTIONS',
				postsOptions: state.contexualPostsOptions,
			});
			return;
		}

		let promises = Set<ReturnType<SearchPosts<P, T>>>([
			props.searchPosts(searchPhrase, valuesState.postType, {
				exclude: posts,
			}),
			props.searchPosts('', valuesState.postType, {
				include: posts,
				per_page: '-1',
			}),
		]);

		Promise.all(promises).then((result) => {
			const postsOptions = result[0] ?? OrderedSet([]);
			const selectedPostsOptions = result[1] ?? OrderedSet([]);

			dispatch({
				type: 'UPDATE_SELECTED_POSTS_OPTIONS',
				selectedPostsOptions,
			});
			dispatch({
				type: 'UPDATE_POSTS_OPTIONS',
				postsOptions,
			});
		});
	};

	const onChangePostType = (postType: T) => {
		const posts = OrderedSet([]);
		setValuesState({ postType, posts });
		props.postType.onChange(postType);
		props.posts.onChange(posts);

		props
			.searchPosts('', postType, {
				exclude: valuesState.posts,
			})
			.then((result) => {
				dispatch({
					type: 'UPDATE_CONTEXUAL_POSTS_OPTIONS',
					contextualPostsOptions: result,
				});
				dispatch({
					type: 'UPDATE_POSTS_OPTIONS',
					postsOptions: result,
				});
				dispatch({
					type: 'UPDATE_SELECTED_POSTS_OPTIONS',
					selectedPostsOptions: posts,
				});
			});
	};

	const posts: EntitiesSearch.PostsControl<P> = {
		...props.posts,
		value: valuesState.posts,
		options: orderSelectedOptionsAtTheTop<P>(
			uniqueControlOptions(
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
				(phrase: SearchPhrase) => {
					const _phrase = extractPhrase(phrase);

					setSearchPhrase(_phrase);

					if (_phrase === '') {
						dispatch({
							type: 'UPDATE_POSTS_OPTIONS',
							postsOptions: state.contexualPostsOptions,
						});
						return;
					}

					searchPostsByPostType(_phrase, valuesState.postType);
				}
			)}
		</>
	);
}

function extractPhrase(phraseOrEvent: SearchPhrase): string {
	return typeof phraseOrEvent === 'string'
		? phraseOrEvent
		: phraseOrEvent.target.value;
}
