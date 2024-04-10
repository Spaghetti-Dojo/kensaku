/**
 * External dependencies
 */
import { describe, it, expect, jest } from '@jest/globals';

/**
 * Internal dependencies
 */
import { Set } from '../../../../sources/client/src/models/set';
import { searchEntitiesOptions } from '../../../../sources/client/src/api/search-entities-options';
import { createSearchEntitiesOptions } from '../../../../sources/client/src/api/create-search-entities-options';

jest.mock(
	'../../../../sources/client/src/api/search-entities-options',
	() => ( {
		searchEntitiesOptions: jest.fn(),
	} )
);

describe( 'Create Search Entities Options', () => {
	it( 'Should create search entities options and receive the correct parameters when called.', () => {
		const _searchEntitiesOptions = createSearchEntitiesOptions( 'post' );

		_searchEntitiesOptions( 'phrase', new Set( [ 'post' ] ) );

		expect( searchEntitiesOptions ).toHaveBeenCalledWith(
			'post',
			'phrase',
			new Set( [ 'post' ] ),
			undefined
		);
	} );
} );
