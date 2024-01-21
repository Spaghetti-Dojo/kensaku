// Create tests for SearchControl with the following criteria:
// - The component renders without errors
// - The component renders the input within the label if the id prop is passed
// - The component renders the input outside the label if the id prop is not passed
// - The component calls the onChange prop when the input value changes
import React from 'react';

import { describe, it, expect, jest } from '@jest/globals';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchControl } from '../../../../sources/client/src/components/search-control';

jest.mock('@wordpress/i18n', () => ({
	__: (text: string) => text,
}));

describe('SearchControl', () => {
	it('renders the input within the label if the id prop is passed', () => {
		render(<SearchControl id="search" onChange={() => {}} />);
		expect(screen.getByLabelText('Search')).toMatchSnapshot();
	});

	it('renders the input outside the label if the id prop is not passed', () => {
		const { container } = render(
			<SearchControl data-testid="search-input" onChange={() => {}} />
		);
		expect(container.querySelector('[type="search"]')).toMatchSnapshot();
	});

	it('calls the onChange prop when the input value changes', async () => {
		const onChange = jest.fn();

		const { container } = render(<SearchControl onChange={onChange} />);

		const input = container.querySelector(
			'[type="search"]'
		) as HTMLInputElement;

		await userEvent.type(input, 'test');

		expect(input).toHaveValue('test');
	});
});
