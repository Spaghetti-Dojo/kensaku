import EntitiesSearch from '@types';

import { describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { reducer } from '../../../../sources/client/src/storage/entities/reducer';
import { Set } from '../../../../sources/client/src/vo/set';

let state: EntitiesSearch.EntitiesState<number, string>;

describe('reducer', () => {
	it('Update the Entities', () => {
		const entities = Set.new<number>();
		const newState = reducer(state, {
			type: 'UPDATE_ENTITIES',
			entities,
		});

		expect(newState.entities).toEqual(entities);
	});

	it('Update the Kind', () => {
		const kind = Set.new(['post']);
		const newState = reducer(state, {
			type: 'UPDATE_KIND',
			kind,
		});

		expect(newState.kind).toEqual(kind);
	});

	it('Update the Contextual Posts Options', () => {
		const contextualPostsOptions = Set.new([
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
			type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS',
			contextualEntitiesOptions: contextualPostsOptions,
		});

		expect(newState.contextualEntitiesOptions).toEqual(
			contextualPostsOptions
		);
	});

	it('Update the Posts Options', () => {
		const postsOptions = Set.new([
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
			type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
			currentEntitiesOptions: postsOptions,
		});

		expect(newState.currentEntitiesOptions).toEqual(postsOptions);
	});

	it('Update the Selected Posts Options with Control Options', () => {
		const posts = Set.new([
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

	it('update search phrase', () => {
		const searchPhrase = faker.lorem.word();
		const newState = reducer(state, {
			type: 'UPDATE_SEARCH_PHRASE',
			searchPhrase,
		});

		expect(newState.searchPhrase).toEqual(searchPhrase);
	});

	it('clean entities options', () => {
		const newState = reducer(state, {
			type: 'CLEAN_ENTITIES_OPTIONS',
		});

		expect(newState.selectedEntitiesOptions).toEqual(Set.new());
		expect(newState.contextualEntitiesOptions).toEqual(Set.new());
		expect(newState.currentEntitiesOptions).toEqual(Set.new());
	});

	it('update entities options for new kind', () => {
		const kind = Set.new(['post']);
		const entitiesOptions = Set.new([
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
			type: 'UPDATE_ENTITIES_OPTIONS_FOR_NEW_KIND',
			kind,
			entitiesOptions,
		});

		expect(newState.contextualEntitiesOptions).toEqual(entitiesOptions);
		expect(newState.currentEntitiesOptions).toEqual(entitiesOptions);
		expect(newState.selectedEntitiesOptions).toEqual(Set.new());
		expect(newState.entities).toEqual(Set.new());
		expect(newState.kind).toEqual(kind);
	});
});
