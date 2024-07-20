/**
 * External dependencies
 */
import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Set } from '../../../../sources/client/src/models/set';
import { createSearchEntitiesOptions } from '../../../../sources/client/src';
import { ControlOption } from '../../../../sources/client/src/value-objects/control-option';
import { PresetEntitiesByKind } from '../../../../sources/client/src/components/preset-entities-by-kind';

describe( 'Preset Entities By Kind', () => {
	it( 'Should render the CompositeEntitiesByKind component with the appropriate configuration', async () => {
		const entitiesFinder =
			jest.fn<
				ReturnType< typeof createSearchEntitiesOptions< string > >
			>();

		const props = {
			entitiesFinder,
			entities: new Set( [ 1, 2, 3 ] ),
			onChangeEntities: jest.fn(),
			entitiesComponent: () => <div>EntitiesComponent</div>,
			kind: 'post',
			kindOptions: stubControlOptionsSet(),
			onChangeKind: jest.fn(),
			kindComponent: () => <div>KindComponent</div>,
			className: 'extra-class-name',
		};

		const rendered = await act( () =>
			render( <PresetEntitiesByKind { ...props } /> )
		);

		expect( rendered.asFragment() ).toMatchSnapshot();
	} );

	it( 'Expect Kind Component to be rendered as first component', async () => {
		const entitiesFinder =
			jest.fn<
				ReturnType< typeof createSearchEntitiesOptions< string > >
			>();

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
		};

		const rendered = await act( () =>
			render( <PresetEntitiesByKind { ...props } /> )
		);

		const kindComponent = screen.getByTestId( 'kind-component' );
		const firstComponent = rendered.container.querySelector(
			'.kensaku-preset-entities-by-kind'
		);

		expect( kindComponent === firstComponent?.firstElementChild ).toEqual(
			true
		);
	} );

	it( 'Expect Entities Component to be rendered as last component', async () => {
		const entitiesFinder =
			jest.fn<
				ReturnType< typeof createSearchEntitiesOptions< string > >
			>();

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
		};

		const rendered = await act( () =>
			render( <PresetEntitiesByKind { ...props } /> )
		);

		const kindComponent = screen.getByTestId( 'entities-component' );
		const firstComponent = rendered.container.querySelector(
			'.kensaku-preset-entities-by-kind'
		);

		expect( kindComponent === firstComponent?.lastElementChild ).toEqual(
			true
		);
	} );

	it( 'Allows extra className property', async () => {
		const entitiesFinder =
			jest.fn<
				ReturnType< typeof createSearchEntitiesOptions< string > >
			>();

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
			className: 'extra-class',
		};

		const rendered = await act( () =>
			render( <PresetEntitiesByKind { ...props } /> )
		);

		expect(
			rendered.container
				.querySelector( '.kensaku-preset-entities-by-kind' )
				?.classList.contains( 'extra-class' )
		).toEqual( true );
	} );
} );

function stubControlOptionsSet() {
	return new Set( [
		new ControlOption( 'Post', 'post' ),
		new ControlOption( 'Page', 'page' ),
	] );
}
