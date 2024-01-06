import { OrderedSet } from 'immutable';
import React from 'react';

import { describe, expect, it, jest } from '@jest/globals';

import { render, screen, fireEvent } from '@testing-library/react';

import { EntitiesToggleControl } from '../../../../sources/js/src/components/entities-toggle-control';

const options = OrderedSet([
	{ label: 'Option 1', value: '1' },
	{ label: 'Option 2', value: '2' },
	{ label: 'Option 3', value: '3' },
]);

describe('EntitiesToggleControl', () => {
	it('renders correctly', () => {
		const { container } = render(
			<EntitiesToggleControl
				className="test-class"
				options={options}
				onChange={() => {}}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('renders the NoOptionsMessage when there are no options', () => {
		const { container } = render(
			<EntitiesToggleControl
				className="test-class"
				options={OrderedSet([])}
				onChange={() => {}}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it('updates the value when one or more option are selected', () => {
		const onChange = jest.fn();

		render(
			<EntitiesToggleControl
				className="test-class"
				options={options}
				value={OrderedSet()}
				onChange={onChange}
			/>
		);

		fireEvent.click(screen.getByLabelText('Option 1'));

		expect(onChange).toHaveBeenCalledWith(OrderedSet(['1']));
	});

	it('updates the value when one or more option are unselected', () => {
		const onChange = jest.fn();

		render(
			<EntitiesToggleControl
				className="test-class"
				options={options}
				value={OrderedSet(['1', '2'])}
				onChange={onChange}
			/>
		);

		fireEvent.click(screen.getByLabelText('Option 1'));

		expect(onChange).toHaveBeenCalledWith(OrderedSet(['2']));
	});
});
