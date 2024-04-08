/**
 * External dependencies
 */
import { faker } from '@faker-js/faker';
import { describe, it, expect, jest } from '@jest/globals';

/**
 * Internal dependencies
 */
import { Set } from '../../../../sources/client/src/models/set';
import { searchPosts } from '../../../../sources/client/src/api/search-posts';
import { searchEntities } from '../../../../sources/client/src/api/search-entities';
import { convertEntitiesToControlOptions } from '../../../../sources/client/src/utils/convert-entities-to-control-options';

jest.mock( '../../../../sources/client/src/api/search-entities', () => ( {
	searchEntities: jest.fn(),
} ) );

describe( 'Search Posts', () => {
	it( 'Should return a Set of Control Option with the title and id.', async () => {
		const stubs = stubEntities();
		jest.mocked( searchEntities ).mockResolvedValue( stubs );
		const posts = await searchPosts( 'Phrase', new Set( [ 'post' ] ) );

		expect( posts.toArray() ).toEqual(
			convertEntitiesToControlOptions( stubs, 'title', 'id' ).toArray()
		);
	} );
} );

function stubEntities(): Set< { id: number; title: string } > {
	return new Set(
		faker.helpers.multiple(
			() => ( {
				title: faker.lorem.word(),
				id: faker.number.int(),
			} ),
			{ count: 3 }
		)
	);
}
