import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { beforeEach, describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { reducer } from '../../../../sources/js/src/storage/entities/reducer';

let state: EntitiesSearch.EntitiesState<number>;

describe('reducer', () => {
	beforeEach(() => {
		state = {
			contexualEntitiesOptions: OrderedSet([]).asMutable(),
			entitiesOptions: OrderedSet([]).asMutable(),
			selectedEntitiesOptions: OrderedSet([]).asMutable(),
		};
	});

	it('Update the Contextual Posts Options', () => {
		const contextualPostsOptions = OrderedSet([
			{
				value: faker.number.int(10),
				label: 'Post One',
			},
			{
				value: faker.number.int({ min: 11, max: 20 }),
				label: 'Post Two',
			},
		]);
		const newState = reducer(state, {
			type: 'UPDATE_CONTEXUAL_ENTITIES_OPTIONS',
			contextualEntitiesOptions: contextualPostsOptions,
		});

		expect(newState.contexualEntitiesOptions).toEqual(
			contextualPostsOptions
		);
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
			type: 'UPDATE_ENTITIES_OPTIONS',
			entitiesOptions: postsOptions,
		});

		expect(newState.entitiesOptions).toEqual(postsOptions);
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
			type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
			selectedEntitiesOptions: posts,
		});

		expect(newState.selectedEntitiesOptions).toEqual(posts);
	});

	it('does nothing if the action type is not recognized', () => {
		const newState = reducer(state, {
			// @ts-ignore
			type: 'NOT_RECOGNIZED_ACTION',
		});

		expect(newState).toEqual(state);
	});
});
