/**
 * External dependencies
 */
import React from 'react';
import Kensaku from '@types';
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Set } from '../../../../sources/client/src/models/set';
import { createSearchEntitiesOptions } from '../../../../sources/client/src';
import { ControlOption } from '../../../../sources/client/src/value-objects/control-option';
import { PresetEntitiesByKind } from '../../../../sources/client/src/components/preset-entities-by-kind';
import { CompositeEntitiesByKind } from '../../../../sources/client/src/components/composite-entities-by-kind';

jest.mock(
	'../../../../sources/client/src/components/composite-entities-by-kind',
	() => ( {
		CompositeEntitiesByKind: jest.fn( () => (
			<div>CompositeEntitiesByKind</div>
		) ),
	} )
);

describe( 'Preset Entities by Kind', () => {
	it( 'Pass the entities fields to the given entitiesFinder function', ( done ) => {
		const entitiesFinder =
			jest.fn<
				ReturnType< typeof createSearchEntitiesOptions< string > >
			>();

		const entitiesFields: Kensaku.SearchQueryFields = [
			'post_content',
			'post_excerpt',
		];

		const props = {
			entitiesFinder,
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

		jest.mocked( entitiesFinder ).mockImplementation(
			// @ts-ignore
			(
				_phrase: string,
				_kind: Kensaku.Kind< string >,
				queryArguments?: Kensaku.QueryArguments
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

		render( <PresetEntitiesByKind { ...props } /> );
	} );
} );

function stubControlOptionsSet() {
	return new Set( [
		new ControlOption( 'Post', 'post' ),
		new ControlOption( 'Page', 'page' ),
	] );
}
