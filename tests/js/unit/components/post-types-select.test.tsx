import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, jest, it, expect } from '@jest/globals';

import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';

import { faker } from '@faker-js/faker';

import { PostTypeSelect } from '../../../../sources/js/src/components/post-type-select';

type ReactSelect = EntitiesSearch.PostTypeSelect & {
	value: EntitiesSearch.ControlOption<string>;
	onChange(value: EntitiesSearch.ControlOption<string> | null): void;
};

jest.mock('react-select', () => (props: ReactSelect) => (
	<select
		data-testid="post-type-select"
		onChange={(event) =>
			props.onChange(
				props.options.find(
					(option) => option.value === event.target.value
				) ?? null
			)
		}
		value={props.value}
		className="react-select"
	>
		{props.options.map((option: any) => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</select>
));

describe('Post Types Select Component', () => {
	/*
	 * We want to ensure the internal logic of the component works as expected, we're not interested
	 * in the React Select component, so we mock it.
	 */
	it('change the value when the user select one', () => {
		let expectedValue: string | null = null;
		const option = {
			label: faker.random.word(),
			value: faker.word.noun(),
		};
		const options = Set<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.merge(buildOptions());

		render(
			<PostTypeSelect
				options={options}
				value={option.value}
				onChange={(value) => (expectedValue = value)}
			/>
		);

		const select = screen.getByTestId('post-type-select');
		fireEvent.change(select, { target: { value: option.value } });
		expect(expectedValue).toEqual(option.value);
	});
});

function buildOptions(): Set<EntitiesSearch.ControlOption<string>> {
	let options = Set<EntitiesSearch.ControlOption<string>>([]);

	for (let count = 0; count < 9; ++count) {
		options = options.add({
			label: faker.random.word(),
			value: faker.word.noun(),
		});
	}

	return options;
}
