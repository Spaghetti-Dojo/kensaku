/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import React from 'react';

import { describe, it, expect, jest } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

/**
 * Internal dependencies
 */
import { SingularSelectControl } from '../../../../sources/client/src/components/singular-select-control';
import { Set } from '../../../../sources/client/src/models/set';
import { buildOptions } from '../utils';

describe( 'Post Types Select', () => {
	/*
	 * We want to ensure the internal logic of the component works as expected, we're not interested
	 * in the React Select component, so we mock it.
	 */
	it( 'call the given onChange handler', ( done ) => {
		let expectedValue: EntitiesSearch.SingularControl< string >[ 'value' ] =
			'';
		const option: EntitiesSearch.ControlOption< string > = {
			label: faker.word.words( 2 ),
			value: faker.word.noun(),
		};
		const options = new Set< EntitiesSearch.ControlOption< string > >()
			.add( option )
			.concat( buildOptions() );

		const rendered = render(
			<SingularSelectControl
				options={ options }
				value={ option.value }
				onChange={ ( value ) => ( expectedValue = value ) }
			/>
		);

		const select = rendered.container.querySelector(
			'.wes-select-control'
		) as HTMLSelectElement;

		userEvent.selectOptions( select, option.value ).then( () => {
			expect( expectedValue ).toBe( option.value );
			done();
		} );
	} );

	it( 'Render No Options Message', () => {
		const rendered = render(
			<SingularSelectControl
				options={ new Set() }
				value={ '' }
				onChange={ () => {} }
			/>
		);

		expect(
			rendered.container.querySelector( '.wes-no-option-message' )
		).toBeInTheDocument();
	} );

	it( 'does not change the value when an option is selected that does not exist', async () => {
		const props = {
			options: new Set( [
				{
					label: 'Option 1',
					value: 'option-one',
				},
				{
					label: 'Option 2',
					value: 'option-two',
				},
			] ),
			value: 'option-two',
			onChange: jest.fn(),
		};
		const rendered = render( <SingularSelectControl { ...props } /> );

		const select = rendered.container.querySelector(
			'.wes-select-control'
		) as HTMLSelectElement;

		const option = select.querySelector(
			'.wes-select-control-item--option-one'
		) as HTMLOptionElement;
		option.value = 'option-3';

		await userEvent.selectOptions( select, option );

		expect( props.onChange ).not.toHaveBeenCalled();
	} );
} );
