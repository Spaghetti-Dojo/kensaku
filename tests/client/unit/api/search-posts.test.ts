/**
 * External dependencies
 */
import EntitiesSearch from '@types';
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

	it( 'Should return a Set of Control Option with the title and id and extra fields.', async () => {
		const stubs = stubEntities();
		jest.mocked( searchEntities ).mockResolvedValue( stubs );
		const posts = await searchPosts( 'Phrase', new Set( [ 'post' ] ), {
			// @ts-ignore
			fields: [ 'title', 'id', 'slug', 'post_content', 'post_excerpt' ],
		} );

		expect( posts.toArray() ).toEqual(
			convertEntitiesToControlOptions(
				stubs,
				'title',
				'id',
				'slug',
				'post_content',
				'post_excerpt'
			).toArray()
		);
	} );

	it( 'Use the given label and value for the Control Options', async () => {
		const stubs = new Set( [
			{
				post_excerpt: faker.lorem.word(),
				slug: faker.lorem.slug(),
			},
		] );

		jest.mocked( searchEntities ).mockResolvedValue( stubs );

		const posts = await searchPosts( 'Phrase', new Set( [ 'post' ] ), {
			// @ts-ignore
			fields: [ 'post_excerpt', 'slug' ],
		} );

		expect( posts.toArray() ).toEqual(
			convertEntitiesToControlOptions(
				stubs,
				'post_excerpt',
				'slug'
			).toArray()
		);
	} );

	it( 'Expect to call searchEntities with the given parameters', async () => {
		const postTypes = new Set( [ 'post' ] );
		const phrase = 'Phrase';
		const fields: EntitiesSearch.SearchQueryFields = [ 'title', 'id' ];
		const queryArguments = {
			fields,
		};

		jest.mocked( searchEntities ).mockResolvedValue( stubEntities() );

		await searchPosts( phrase, postTypes, queryArguments );

		expect( searchEntities ).toHaveBeenCalledWith(
			'post',
			postTypes,
			phrase,
			queryArguments
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
