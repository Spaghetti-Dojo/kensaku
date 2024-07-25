/**
 * External dependencies
 */
import { fromPartial } from '@total-typescript/shoehorn';
import Kensaku from '@types';

import { describe, it, jest, expect } from '@jest/globals';

/**
 * Internal dependencies
 */
import { useEntityRecords } from '../../../../sources/client/src/hooks/use-entity-records';
import { useQueryViewablePostTypes } from '../../../../sources/client/src/hooks/use-query-viewable-post-types';
import { Set } from '../../../../sources/client/src/models/set';

jest.mock( '@wordpress/data', () => {
	return {
		useSelect: jest.fn(),
	};
} );
jest.mock( '../../../../sources/client/src/hooks/use-entity-records', () => {
	return {
		useEntityRecords: jest.fn(),
	};
} );

describe( 'Post Types Query', () => {
	it( 'retrieve all viewable post types', () => {
		jest.mocked( useEntityRecords ).mockReturnValue( {
			isResolving: () => false,
			errored: () => false,
			succeed: () => true,
			records: () =>
				new Set( [
					fromPartial< Kensaku.PostType< 'edit' > >( {
						slug: 'viewable-post-type',
						viewable: true,
					} ),
					fromPartial< Kensaku.PostType< 'edit' > >( {
						slug: 'not-viewable-post-type',
						viewable: false,
					} ),
				] ),
		} );

		const postTypes = useQueryViewablePostTypes();
		expect( postTypes.records().length() ).toEqual( 1 );
		for ( const viewablePostType of postTypes.records() ) {
			expect( viewablePostType.viewable ).toEqual( true );
		}
	} );

	it( 'returns empty set while resolving the post types', () => {
		jest.mocked( useEntityRecords ).mockReturnValue( {
			isResolving: () => true,
			errored: () => false,
			succeed: () => false,
			records: () => new Set(),
		} );

		const viewablePostTypes = useQueryViewablePostTypes();
		expect( viewablePostTypes.records().length() ).toEqual( 0 );
	} );
} );
