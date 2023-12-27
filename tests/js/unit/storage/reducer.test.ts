import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { beforeEach, describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { reducer } from '../../../../sources/js/src/storage/posts/reducer';

let state: EntitiesSearch.PostsState<number>;

describe('reducer', () => {
	beforeEach(() => {
		state = {
			contexualPostsOptions: OrderedSet([]).asMutable(),
			postsOptions: OrderedSet([]).asMutable(),
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
			selectedPostsOptions: posts,
		});

		expect(newState.selectedPostsOptions).toEqual(posts);
	});

	it('does nothing if the action type is not recognized', () => {
		const newState = reducer(state, {
			// @ts-ignore
			type: 'NOT_RECOGNIZED_ACTION',
		});

		expect(newState).toEqual(state);
	});
});
