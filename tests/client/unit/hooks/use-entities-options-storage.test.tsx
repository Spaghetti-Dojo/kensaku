import EntitiesSearch from '@types';
import React from 'react';

import { describe, expect, it, jest } from '@jest/globals';

import { act, render } from '@testing-library/react';

import { doAction } from '@wordpress/hooks';

import { useEntitiesOptionsStorage } from '../../../../sources/client/src/hooks/use-entities-options-storage';
import { Set } from '../../../../sources/client/src/vo/set';

jest.mock('@wordpress/hooks', () => ({
	doAction: jest.fn(),
}));

describe('Use Posts Options Storage', () => {
	it('Ensure seachEntities is called with the right data on state hydratation.', async () => {
		const kind = Set.new(['post']);
		const entities = Set.new([1, 2, 3]);
		const searchEntities = jest.fn(() =>
			Promise.resolve(
				Set.new([
					{
						label: 'post-title',
						value: 1,
					},
				])
			)
		) as jest.Mock<EntitiesSearch.SearchEntitiesFunction<number, string>>;

		const Component = () => {
			useEntitiesOptionsStorage<number, string>(
				{
					kind,
					entities,
				},
				searchEntities
			);

			return null;
		};

		await act(() => render(<Component />));

		expect(searchEntities).toHaveBeenCalledWith('', kind, {
			exclude: entities,
		});
		expect(searchEntities).toHaveBeenCalledWith('', kind, {
			include: entities,
			per_page: '-1',
		});
	});

	it('Update the state based on the given kind and entities', async () => {
		const kind = Set.new(['post']);
		const entities = Set.new([1, 2, 3]);
		const selectedEntitiesOptions = Set.new([
			{
				label: 'post-title-1',
				value: 1,
			},
			{
				label: 'post-title-2',
				value: 2,
			},
			{
				label: 'post-title-3',
				value: 3,
			},
		]);
		const currentEntitiesOptions = Set.new([
			{
				label: 'post-title-4',
				value: 4,
			},
			{
				label: 'post-title-5',
				value: 5,
			},
			{
				label: 'post-title-6',
				value: 6,
			},
		]);

		const searchEntities = jest.fn((_phrase, _kind, options) => {
			if (options?.include) {
				return Promise.resolve(selectedEntitiesOptions);
			}

			return options?.include
				? Promise.resolve(selectedEntitiesOptions)
				: Promise.resolve(currentEntitiesOptions);
		}) as jest.Mock<EntitiesSearch.SearchEntitiesFunction<number, string>>;

		const dispatch = jest.fn();
		jest.spyOn(React, 'useReducer').mockImplementation((_, state) => [
			state,
			dispatch,
		]);

		const Component = () => {
			useEntitiesOptionsStorage<number, string>(
				{
					kind,
					entities,
				},
				searchEntities
			);

			return null;
		};

		await act(() => render(<Component />));

		expect(dispatch).toHaveBeenCalledWith({
			type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
			selectedEntitiesOptions,
		});
		expect(dispatch).toHaveBeenCalledWith({
			type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS',
			contextualEntitiesOptions: currentEntitiesOptions,
		});
		expect(dispatch).toHaveBeenCalledWith({
			type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
			currentEntitiesOptions,
		});
	});

	it('Sete the current and selected entities options to an empty set if searchEntities fails', async () => {
		const kind = Set.new(['post']);
		const entities = Set.new([1, 2, 3]);
		const searchEntities = jest.fn(() =>
			Promise.resolve(null)
		) as jest.Mock<() => Promise<null>>;

		const dispatch = jest.fn();
		jest.spyOn(React, 'useReducer').mockImplementation((_, state) => [
			state,
			dispatch,
		]);

		const Component = () => {
			useEntitiesOptionsStorage<number, string>(
				{
					kind,
					entities,
				},
				// @ts-ignore
				searchEntities
			);

			return null;
		};

		await act(() => render(<Component />));

		const expectedSet = Set.new();

		expect(dispatch).toHaveBeenCalledWith({
			type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
			selectedEntitiesOptions: expectedSet,
		});
		expect(dispatch).toHaveBeenCalledWith({
			type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS',
			contextualEntitiesOptions: expectedSet,
		});
		expect(dispatch).toHaveBeenCalledWith({
			type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
			currentEntitiesOptions: expectedSet,
		});
	});

	it('Does not call searchEntities with includes if entities is empty', async () => {
		const kind = Set.new(['post']);
		const entities = Set.new();
		const searchEntities = jest.fn(() =>
			Promise.resolve(
				Set.new([
					{
						label: 'post-title',
						value: 1,
					},
				])
			)
		) as jest.Mock<EntitiesSearch.SearchEntitiesFunction<number, string>>;

		const Component = () => {
			useEntitiesOptionsStorage<number, string>(
				{
					kind,
					// @ts-ignore
					entities,
				},
				searchEntities
			);

			return null;
		};

		await act(() => render(<Component />));

		expect(searchEntities).toHaveBeenCalledTimes(1);
		expect(searchEntities).toHaveBeenCalledWith('', kind, {
			exclude: entities,
		});
		expect(searchEntities).not.toHaveBeenCalledWith('', kind, {
			include: entities,
			per_page: '-1',
		});
	});

	it('Execute the action wp-entities-search.on-storage-initialization.error when there is an error on searchEntites', async () => {
		const kind = Set.new(['post']);
		const entities = Set.new([1, 2, 3]);
		const searchEntities = jest.fn(() =>
			Promise.reject('Search Entities Failed.')
		);

		const Component = () => {
			useEntitiesOptionsStorage<number, string>(
				{
					kind,
					entities,
				},
				// @ts-ignore
				searchEntities
			);

			return null;
		};

		await act(() => render(<Component />));

		expect(doAction).toHaveBeenCalledWith(
			'wp-entities-search.on-storage-initialization.error',
			'Search Entities Failed.'
		);
	});
});
