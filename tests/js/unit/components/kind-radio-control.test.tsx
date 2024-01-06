// Write a test for the KindRadioControl component here
// - the test must ensure the correctness of the component's rendering
// - the test expects the value change accordingly to the selection
// - the test expects no rendering when the options are empty
import { OrderedSet } from 'immutable';
import React from 'react';

import { expect, jest, describe, it } from '@jest/globals';

import { render, screen, fireEvent } from '@testing-library/react';

import { KindRadioControl } from '../../../../sources/js/src/components/kind-radio-control';

describe('KindRadioControl', () => {
	it('renders the component', () => {
		const props = {
			className: 'test-class',
			options: OrderedSet([
				{
					label: 'Option 1',
					value: 'option-one',
				},
			]),
			value: 'option-one',
			onChange: jest.fn(),
		};
		render(<KindRadioControl {...props} />);

		expect(screen.getByLabelText('Option 1')).toMatchSnapshot();
	});

	it('renders the NoOptionsMessage when there are no options', () => {
		const props = {
			className: 'test-class',
			options: OrderedSet([]),
			value: 'option-one',
			onChange: jest.fn(),
		};
		const { container } = render(<KindRadioControl {...props} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('check the input based on the value given', () => {
		const props = {
			className: 'test-class',
			options: OrderedSet([
				{
					label: 'Option 1',
					value: 'option-one',
				},
				{
					label: 'Option 2',
					value: 'option-2',
				},
			]),
			value: 'option-one',
			onChange: jest.fn(),
		};
		render(<KindRadioControl {...props} />);

		expect(screen.getByLabelText('Option 1')).toBeChecked();
	});

	it('changes the value when an option is selected', () => {
		const props = {
			options: OrderedSet([
				{
					label: 'Option 1',
					value: 'option-one',
				},
				{
					label: 'Option 2',
					value: 'option-2',
				},
			]),
			value: 'option-one',
			onChange: jest.fn(),
		};
		render(<KindRadioControl {...props} />);

		fireEvent.click(screen.getByLabelText('Option 2'));

		expect(props.onChange).toHaveBeenCalledWith('option-2');
	});
});
