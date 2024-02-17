/**
 * External dependencies
 */
import { fromPartial } from '@total-typescript/shoehorn';
import EntitiesSearch from '@types';

import { describe, it, jest, expect } from '@jest/globals';

/**
 * WordPress dependencies
 */
import { useEntityRecords as useCoreEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { useEntityRecords } from '../../../../sources/client/src';

jest.mock( '@wordpress/core-data', () => ( {
	useEntityRecords: jest.fn(),
} ) );

describe( 'useEntityRecords', () => {
	/*
	 * We want to guarantee the Records are returned and the hook succeeds.
	 * Shouldn't be possible to obtain a succeed status if the records are resolving or errored.
	 */
	it( 'return set of records and succeed', () => {
		const records = [
			fromPartial< EntitiesSearch.PostType< 'edit' > >( {
				name: 'foo',
			} ),
			fromPartial< EntitiesSearch.PostType< 'edit' > >( {
				name: 'foo-3',
			} ),
		];

		jest.mocked( useCoreEntityRecords ).mockReturnValue( {
			records,
			hasResolved: true,
			isResolving: false,
			// @ts-ignore
			status: 'SUCCESS',
		} );

		const result = useEntityRecords< EntitiesSearch.PostType< 'edit' > >(
			'root',
			'postType'
		);

		expect( result.records().length() ).toEqual( 2 );
		for ( const record of records ) {
			expect( result.records() ).toContain( record );
		}

		expect( result.isResolving() ).toEqual( false );
		expect( result.errored() ).toEqual( false );
		expect( result.succeed() ).toEqual( true );
	} );

	/*
	 * We want to guarantee `records()` returns null when the hook is resolving.
	 */
	it( 'return an empty collection of records when resolving', () => {
		jest.mocked( useCoreEntityRecords ).mockReturnValue( {
			records: null,
			hasResolved: false,
			isResolving: true,
			// @ts-ignore
			status: 'RESOLVING',
		} );

		const result = useEntityRecords< EntitiesSearch.PostType< 'edit' > >(
			'root',
			'postType'
		);

		expect( result.records().length() ).toEqual( 0 );
		expect( result.isResolving() ).toEqual( true );
		expect( result.errored() ).toEqual( false );
		expect( result.succeed() ).toEqual( false );
	} );

	/*
	 * We want to errored and succeed are not returning the same value.
	 */
	it( 'return errored and succeed as different values', () => {
		jest.mocked( useCoreEntityRecords ).mockReturnValue( {
			records: null,
			hasResolved: true,
			isResolving: false,
			// @ts-ignore
			status: 'ERROR',
		} );

		const result = useEntityRecords< EntitiesSearch.PostType< 'edit' > >(
			'root',
			'postType'
		);

		expect( result.isResolving() ).toEqual( false );
		expect( result.errored() ).toEqual( true );
		expect( result.succeed() ).toEqual( false );
	} );

	/*
	 * We want to guarantee the errored and success statuses are not returning `true` while resolving.
	 */
	it( 'return errored and succeed as false while resolving', () => {
		jest.mocked( useCoreEntityRecords ).mockReturnValue( {
			records: null,
			hasResolved: false,
			isResolving: true,
			// @ts-ignore
			status: 'RESOLVING',
		} );

		const result = useEntityRecords< EntitiesSearch.PostType< 'edit' > >(
			'root',
			'postType'
		);

		expect( result.isResolving() ).toEqual( true );
		expect( result.errored() ).toEqual( false );
		expect( result.succeed() ).toEqual( false );
	} );
} );
