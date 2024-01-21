import EntitiesSearch from '@types';
import React from 'react';

import { expect, jest, describe, it } from '@jest/globals';

import { render, screen, fireEvent } from '@testing-library/react';

import { RadioControl } from '../../../../sources/client/src/components/radio-control';
import { Set } from '../../../../sources/client/src/vo/set';

describe('KindRadioControl', () => {
	it('renders the component', () => {
		const props = {
			className: 'test-class',
			options: new Set([
				{
					label: 'Option 1',
					value: 'option-one',
				},
			]),
			value: 'option-one',
			onChange: jest.fn(),
		};
		render(<RadioControl {...props} />);

		expect(screen.getByLabelText('Option 1')).toMatchSnapshot();
	});

	it('renders the NoOptionsMessage when there are no options', () => {
		const props = {
			className: 'test-class',
			options: new Set<EntitiesSearch.ControlOption<any>>(),
			value: 'option-one',
			onChange: jest.fn(),
		};
		const { container } = render(<RadioControl {...props} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('check the input based on the value given', () => {
		const props = {
			className: 'test-class',
			options: new Set([
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
		render(<RadioControl {...props} />);

		expect(screen.getByLabelText('Option 1')).toBeChecked();
	});

	it('changes the value when an option is selected', () => {
		const props = {
			options: new Set([
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
		render(<RadioControl {...props} />);

		fireEvent.click(screen.getByLabelText('Option 2'));

		expect(props.onChange).toHaveBeenCalledWith('option-2');
	});
});
