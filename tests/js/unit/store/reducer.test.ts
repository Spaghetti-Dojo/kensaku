import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { beforeEach, describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { reducer } from '../../../../sources/js/src/storage/posts/reducer';

let state: EntitiesSearch.PostsState<number>;

describe('reducer', () => {
	beforeEach(() => {
		state = {
			initialPostsOptions: OrderedSet([]).asMutable(),
			postsOptions: OrderedSet([]).asMutable(),
			cachedPostsOptions: OrderedSet([]).asMutable(),
			selectedPostsOptions: OrderedSet([]).asMutable(),
		};
	});

	it('Update the Posts Options', () => {
		const postsOptions = OrderedSet([
			{
				value: faker.number.int(10),
				label: 'Post Two',
			},
			{
				value: faker.number.int({ min: 11, max: 20 }),
				label: 'Post Three',
			},
		]);
		const newState = reducer(state, {
			type: 'UPDATE_POSTS_OPTIONS',
			postsOptions,
		});

		expect(newState.postsOptions).toEqual(postsOptions);
	});

	it('Update the cached Posts Options when Updating Posts Options', () => {
		const postsOptions = OrderedSet([
			{
				value: faker.number.int(10),
				label: 'Post Two',
			},
			{
				value: faker.number.int({ min: 11, max: 20 }),
				label: 'Post Three',
			},
		]);
		const newState = reducer(state, {
			type: 'UPDATE_POSTS_OPTIONS',
			postsOptions,
		});

		expect(newState.cachedPostsOptions).toEqual(postsOptions);
	});

	it('Update the Selected Posts Options', () => {
		state = {
			...state,
			cachedPostsOptions: OrderedSet([
				{
					value: 55,
					label: 'Post FiftyFive',
				},
				{
					value: 10,
					label: 'Post Ten',
				},
				{
					value: 93,
					label: 'Post NinetyThree',
				},
			]),
		};

		const posts = OrderedSet([55, 10]);
		const newState = reducer(state, {
			type: 'UPDATE_SELECTED_POSTS_OPTIONS',
			posts,
		});

		expect(newState).toEqual({
			...state,
			selectedPostsOptions: OrderedSet([
				{
					value: 55,
					label: 'Post FiftyFive',
				},
				{
					value: 10,
					label: 'Post Ten',
				},
			]),
		});
	});

	it('Update the Selected Posts Options with Control Options', () => {
		const posts = OrderedSet([
			{
				value: 55,
				label: 'Post FiftyFive',
			},
			{
				value: 10,
				label: 'Post Ten',
			},
		]);
		const newState = reducer(state, {
			type: 'UPDATE_SELECTED_POSTS_OPTIONS',
			posts,
		});

		expect(newState.selectedPostsOptions).toEqual(posts);
	});

	it('Reset the Selected Posts Options when the given Posts is undefined', () => {
		state = {
			...state,
			selectedPostsOptions: OrderedSet([
				{
					value: 55,
					label: 'Post FiftyFive',
				},
				{
					value: 10,
					label: 'Post Ten',
				},
			]),
		};

		const newState = reducer(state, {
			type: 'UPDATE_SELECTED_POSTS_OPTIONS',
			posts: undefined,
		});

		expect(newState.selectedPostsOptions).toEqual(OrderedSet([]));
	});
});
