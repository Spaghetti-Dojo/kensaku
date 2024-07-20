/**
 * External dependencies
 */
import Kensaku from '@types';

import { describe, expect, it, jest } from '@jest/globals';

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { fetch } from '../../../../sources/client/src/api/fetch';
import { searchEntities } from '../../../../sources/client/src/api/search-entities';
import { Set } from '../../../../sources/client/src/models/set';

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

jest.mock( '../../../../sources/client/src/api/fetch', () => ( {
	fetch: jest.fn(),
} ) );

describe( 'Search Posts', () => {
	it( 'perform a search with the given parameters', async () => {
		let expectedPath: string = '';
		// @ts-ignore
		jest.mocked( fetch ).mockImplementation( ( options: any ) => {
			expectedPath = options.path;
			// Fetch result is irrelevant for this test
			return Promise.resolve( [] );
		} );

		await searchEntities( 'post', new Set( [ 'post' ] ), 'foo', {
			exclude: new Set< string >( [ '1', '3' ] ),
			include: new Set< string >( [ '2', '5' ] ),
		} );

		expect( expectedPath ).toBe(
			'?rest_route=/wp/v2/search&per_page=10&order=DESC&orderBy=title&exclude=1%2C3&include=2%2C5&type=post&search=foo&subtype=post&_fields=title%2Cid'
		);
	} );

	it( 'return the immutable set of entities', async () => {
		const expected = [
			{ id: 1, title: { rendered: 'Foo' } },
			{ id: 2, title: { rendered: 'Bar' } },
		];

		// @ts-ignore
		jest.mocked( fetch ).mockResolvedValue( expected );

		const entities = await searchEntities< Kensaku.Post >(
			'post',
			new Set( [ 'post' ] ),
			'foo',
			{
				exclude: new Set< string >( [ '1', '3' ] ),
				include: new Set< string >( [ '2', '5' ] ),
			}
		);

		entities.toArray().forEach( ( entity, index ) => {
			expect( entity.id ).toEqual( expected[ index ]?.id );
			expect( entity.title.rendered ).toEqual(
				expected[ index ]?.title?.rendered
			);
		} );
	} );

	it( 'abort the request when the search is aborted', async () => {
		let expectedError: Error;

		// @ts-ignore
		jest.mocked( fetch ).mockImplementation( () =>
			Promise.reject(
				new DOMException( 'Aborted Request', 'AbortError' )
			)
		);

		try {
			await searchEntities( 'post', new Set( [ 'post' ] ), 'foo', {
				exclude: new Set< string >( [ '1', '3' ] ),
				include: new Set< string >( [ '2', '5' ] ),
			} );
		} catch ( error: any ) {
			expectedError = error;
		}

		// @ts-ignore
		expect( expectedError.name ).toBe( 'AbortError' );
		expect( doAction ).toHaveBeenCalledWith(
			'kensaku.on-search.abort',
			// @ts-ignore
			expectedError
		);
	} );

	it( 'do not execute aborted action when wrong error type', async () => {
		let expectedError: Error;

		// @ts-ignore
		jest.mocked( fetch ).mockImplementation( () =>
			Promise.reject( new Error( 'Aborted Request' ) )
		);

		try {
			await searchEntities( 'post', new Set( [ 'post' ] ), 'foo', {
				exclude: new Set< string >( [ '1', '3' ] ),
				include: new Set< string >( [ '2', '5' ] ),
			} );
		} catch ( error: any ) {
			expectedError = error;
		}

		// @ts-ignore
		expect( expectedError.message ).toBe( 'Aborted Request' );
		expect( doAction ).not.toHaveBeenCalled();
	} );
} );
