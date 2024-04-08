/**
 * External dependencies
 */
import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { PresetPostsTypes } from '../../../../sources/client/src/components/preset-posts-types';
import { ControlOption } from '../../../../sources/client/src/value-objects/control-option';
import { Set } from '../../../../sources/client/src/models/set';

describe( 'Preset Posts Types', () => {
	it( 'Should render the CompositeEntitiesByKind component with the appropriate configuration', async () => {
		const props = {
			entities: new Set( [ 1, 2, 3 ] ),
			onChangeEntities: jest.fn(),
			entitiesComponent: () => <div>EntitiesComponent</div>,
			kind: 'post',
			kindOptions: stubControlOptionsSet(),
			onChangeKind: jest.fn(),
			kindComponent: () => <div>KindComponent</div>,
		};
		const rendered = await render( <PresetPostsTypes { ...props } /> );

		expect( rendered.asFragment() ).toMatchSnapshot();
	} );

	it( 'Expect Kind Component to be rendered as first component', async () => {
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
		};
		const rendered = await render( <PresetPostsTypes { ...props } /> );

		const kindComponent = screen.getByTestId( 'kind-component' );
		const firstComponent = rendered.container.querySelector(
			'.wes-preset-posts-types'
		);

		expect( kindComponent === firstComponent?.firstElementChild ).toEqual(
			true
		);
	} );

	it( 'Expect Entities Component to be rendered as last component', async () => {
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
		};
		const rendered = await render( <PresetPostsTypes { ...props } /> );

		const kindComponent = screen.getByTestId( 'entities-component' );
		const firstComponent = rendered.container.querySelector(
			'.wes-preset-posts-types'
		);

		expect( kindComponent === firstComponent?.lastElementChild ).toEqual(
			true
		);
	} );
} );

function stubControlOptionsSet() {
	return new Set( [
		new ControlOption( 'Post', 'post' ),
		new ControlOption( 'Page', 'page' ),
	] );
}
