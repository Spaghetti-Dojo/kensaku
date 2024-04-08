/**
 * External dependencies
 */
import React from 'react';
import EntitiesSearch from '@types';
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { PresetPostsTypes } from '../../../../sources/client/src/components/preset-posts-types';
import { ControlOption } from '../../../../sources/client/src/value-objects/control-option';
import { Set } from '../../../../sources/client/src/models/set';
import { searchPosts } from '../../../../sources/client/src/api/search-posts';
import { CompositeEntitiesByKind } from '../../../../sources/client/src/components/composite-entities-by-kind';

jest.mock( '../../../../sources/client/src/api/search-posts', () => ( {
	searchPosts: jest.fn(),
} ) );

jest.mock(
	'../../../../sources/client/src/components/composite-entities-by-kind',
	() => ( {
		CompositeEntitiesByKind: jest.fn( () => (
			<div>CompositeEntitiesByKind</div>
		) ),
	} )
);

describe( 'Preset Post Types', () => {
	it( 'Pass the entities fields to the given searchPosts function', ( done ) => {
		const entitiesFields: EntitiesSearch.SearchQueryFields = [
			'post_content',
			'post_excerpt',
		];
		const props = {
			entities: new Set( [ 1, 2, 3 ] ),
			onChangeEntities: jest.fn(),
			entitiesComponent: () => (
				<div data-testid="entities-component">EntitiesComponent</div>
			),
			kind: 'post',
			kindOptions: stubControlOptionsSet(),
			onChangeKind: jest.fn(),
			kindComponent: () => (
				<div data-testid="kind-component">KindComponent</div>
			),
			entitiesFields,
		};

		jest.mocked( searchPosts ).mockImplementation(
			// @ts-ignore
			(
				_phrase: string,
				_postTypes: EntitiesSearch.Kind< string >,
				queryArguments?: EntitiesSearch.QueryArguments
			) => {
				expect( queryArguments?.fields ).toEqual( [
					'title',
					'id',
					'post_content',
					'post_excerpt',
				] );
				done();
			}
		);

		jest.mocked( CompositeEntitiesByKind ).mockImplementation(
			( { searchEntities } ) => {
				// @ts-ignore
				searchEntities( 'phrase', new Set( [ 'post' ] ) );
				return <div>CompositeEntitiesByKind</div>;
			}
		);

		render( <PresetPostsTypes { ...props } /> );
	} );
} );

function stubControlOptionsSet() {
	return new Set( [
		new ControlOption( 'Post', 'post' ),
		new ControlOption( 'Page', 'page' ),
	] );
}
