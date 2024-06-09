/**
 * External dependencies
 */
import { fromPartial } from '@total-typescript/shoehorn';
import EntitiesSearch from '@types';

import { describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

/**
 * Internal dependencies
 */
import { convertEntitiesToControlOptions } from '../../../../sources/client/src/utils/convert-entities-to-control-options';
import { Set } from '../../../../sources/client/src/models/set';

type ExtendedSearchEntityFields = EntitiesSearch.SearchEntityFields & {
	type: string;
	excerpt: string;
};

describe( 'Convert Entities To Control Options', () => {
	it( 'correctly convert entities to control options', () => {
		const rawEntities = [];
		for ( let count = 0; count < 10; ++count ) {
			rawEntities.push(
				fromPartial< ExtendedSearchEntityFields >( {
					title: faker.word.noun(),
					id: faker.number.int(),
				} )
			);
		}

		const entities = new Set< ExtendedSearchEntityFields >( rawEntities );

		const options = convertEntitiesToControlOptions(
			entities,
			'title',
			'id'
		).map( ( option ) => option.value );
		for ( const entity of entities ) {
			expect( options.has( entity.id ) ).toEqual( true );
		}
	} );

	it( 'throws an error if the option label is not a string', () => {
		const rawEntities = [];
		for ( let count = 0; count < 10; ++count ) {
			rawEntities.push(
				fromPartial< ExtendedSearchEntityFields >( {
					title: faker.word.noun(),
					id: faker.number.int(),
				} )
			);
		}

		const entities = new Set< ExtendedSearchEntityFields >( rawEntities );

		expect( () => {
			// To make the test fail, we pass the id as the label key
			convertEntitiesToControlOptions( entities, 'id', 'id' );
		} ).toThrow();
	} );

	it( 'add extra data to the control options', () => {
		const rawEntity = fromPartial< ExtendedSearchEntityFields >( {
			title: faker.word.noun(),
			id: faker.number.int(),
			type: faker.helpers.arrayElement( [ 'post', 'page', 'product' ] ),
			excerpt: faker.lorem.sentence(),
		} );

		const entities = new Set< ExtendedSearchEntityFields >( [ rawEntity ] );
		const options = convertEntitiesToControlOptions(
			entities,
			'title',
			'id',
			'type',
			'excerpt'
		);

		const option = options.first();
		// @ts-ignore
		expect( option?.extra.get( 'type' ) ).toEqual( rawEntity.type );
		// @ts-ignore
		expect( option?.extra.get( 'excerpt' ) ).toEqual( rawEntity.excerpt );
	} );
} );
