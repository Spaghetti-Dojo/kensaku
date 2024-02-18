/*
 * We have to write a set of tests to check the behavior of the search function returned by the useSearch hook.
 * Particularly we want to mock the  useThrottle hook to exectute the search function immediately without waiting for the throttle time.
 * We also want to mock the searchEntities function to return a set of options or when necessary throw an error.
 * The dispatch function is also mocked to check if the state is updated correctly.
 */
/**
 * External dependencies
 */
import EntitiesSearch from '@types';

import { expect, it, describe, beforeEach, jest } from '@jest/globals';

import { renderHook, act } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { useSearch } from '../../../../sources/client/src/hooks/use-search';
import { Set } from '../../../../sources/client/src/models/set';

jest.mock( '@wordpress/compose', () => ( {
	useThrottle: ( callback: ( phrase: string ) => void ) => callback,
} ) );
jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

describe( 'useSearch', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'Should update the search phrase', async () => {
		const searchEntities = jest.fn( () =>
			Promise.resolve( new Set( [ { label: 'Label', value: 1 } ] ) )
		) as jest.Mock< EntitiesSearch.SearchEntitiesFunction< any, any > >;
		const kind = new Set( [ 'post' ] );
		const entities = new Set< number >();
		const dispatch = jest.fn();

		const { result } = renderHook( () =>
			useSearch( searchEntities, kind, entities, dispatch )
		);

		await act( () => {
			result.current( 'phrase' );
		} );

		expect( dispatch ).toHaveBeenCalledWith( {
			type: 'UPDATE_SEARCH_PHRASE',
			searchPhrase: 'phrase',
		} );
	} );

	it( 'Should search the entities', () => {
		const searchEntities = jest.fn( () =>
			Promise.resolve( new Set( [ { label: 'Label', value: 1 } ] ) )
		) as jest.Mock< EntitiesSearch.SearchEntitiesFunction< any, any > >;
		const kind = new Set( [ 'post' ] );
		const entities = new Set< number >();
		const dispatch = jest.fn();

		const { result } = renderHook( () =>
			useSearch( searchEntities, kind, entities, dispatch )
		);

		act( () => {
			result.current( 'phrase' );
		} );

		expect( searchEntities ).toHaveBeenCalledTimes( 1 );
		expect( searchEntities ).toHaveBeenCalledWith( 'phrase', kind, {
			exclude: entities,
		} );
	} );

	it( 'Should update the current entities options', async () => {
		const searchEntities = jest.fn( () =>
			Promise.resolve( new Set( [ { label: 'Label', value: 1 } ] ) )
		) as jest.Mock< EntitiesSearch.SearchEntitiesFunction< any, any > >;
		const kind = new Set( [ 'post' ] );
		const entities = new Set< number >();
		const dispatch = jest.fn();

		const { result } = renderHook( () =>
			useSearch( searchEntities, kind, entities, dispatch )
		);

		searchEntities.mockResolvedValueOnce(
			new Set( [
				{
					value: 1,
					label: 'Post One',
				},
				{
					value: 2,
					label: 'Post Two',
				},
			] )
		);

		await act( () => {
			result.current( 'phrase' );
		} );

		expect( dispatch ).toHaveBeenCalledWith( {
			type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
			currentEntitiesOptions: new Set( [
				{
					value: 1,
					label: 'Post One',
				},
				{
					value: 2,
					label: 'Post Two',
				},
			] ),
		} );
	} );

	it( 'Should update the current entities options with an empty set when an error occurs', async () => {
		const searchEntities = jest.fn( () =>
			Promise.resolve( new Set( [ { label: 'Label', value: 1 } ] ) )
		) as jest.Mock< EntitiesSearch.SearchEntitiesFunction< any, any > >;
		const kind = new Set( [ 'post' ] );
		const entities = new Set< number >();
		const dispatch = jest.fn();

		const { result } = renderHook( () =>
			useSearch( searchEntities, kind, entities, dispatch )
		);

		searchEntities.mockRejectedValueOnce( new Error( 'Error' ) );

		await act( () => {
			result.current( 'phrase' );
		} );

		expect( jest.mocked( doAction ) ).toHaveBeenCalledTimes( 1 );
		expect( jest.mocked( doAction ) ).toHaveBeenCalledWith(
			'wp-entities-search.on-search.error',
			new Error( 'Error' )
		);
	} );
} );
