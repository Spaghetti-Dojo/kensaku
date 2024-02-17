/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import React from 'react';

import { expect, jest, describe, it } from '@jest/globals';

import { render, screen, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { RadioControl } from '../../../../sources/client/src/components/radio-control';
import { Set } from '../../../../sources/client/src/vo/set';

describe( 'KindRadioControl', () => {
	it( 'renders the component', () => {
		const props = {
			className: 'test-class',
			options: new Set( [
				{
					label: 'Option 1',
					value: 'option-one',
				},
			] ),
			value: 'option-one',
			onChange: jest.fn(),
		};
		render( <RadioControl { ...props } /> );

		expect( screen.getByLabelText( 'Option 1' ) ).toMatchSnapshot();
	} );

	it( 'renders the NoOptionsMessage when there are no options', () => {
		const props = {
			className: 'test-class',
			options: new Set< EntitiesSearch.ControlOption< any > >(),
			value: 'option-one',
			onChange: jest.fn(),
		};
		const { container } = render( <RadioControl { ...props } /> );

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it.each( [
		[
			new Set( [
				{
					label: 'Option 1',
					value: 'option-one',
				},
				{
					label: 'Option 2',
					value: 'option-2',
				},
			] ),
			'option-one',
		],
		[
			new Set( [
				{
					label: 'Option 1',
					value: 1,
				},
				{
					label: 'Option 2',
					value: 2,
				},
			] ),
			1,
		],
	] )( 'check the input based on the value given', ( options, value ) => {
		const props = {
			className: 'test-class',
			options,
			value,
			onChange: jest.fn(),
		};
		render( <RadioControl { ...props } /> );

		expect( screen.getByLabelText( 'Option 1' ) ).toBeChecked();
	} );

	it.each( [
		[
			new Set( [
				{
					label: 'Option 1',
					value: 'option-one',
				},
				{
					label: 'Option 2',
					value: 'option-2',
				},
			] ),
			'option-one',
			'option-2',
		],
		[
			new Set( [
				{
					label: 'Option 1',
					value: 1,
				},
				{
					label: 'Option 2',
					value: 2,
				},
			] ),
			1,
			2,
		],
	] )(
		'changes the value when an option is selected',
		( options, value, expected ) => {
			const props = {
				options,
				value,
				onChange: jest.fn(),
			};
			render( <RadioControl { ...props } /> );

			fireEvent.click( screen.getByLabelText( 'Option 2' ) );

			expect( props.onChange ).toHaveBeenCalledWith( expected );
		}
	);

	it( 'does not change the value when an option is selected that does not exist', () => {
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
		render( <RadioControl { ...props } /> );

		const option = screen.getByLabelText< HTMLInputElement >( 'Option 1' );
		option.value = 'option-3';

		fireEvent.click( option );

		expect( props.onChange ).not.toHaveBeenCalled();
	} );
} );
