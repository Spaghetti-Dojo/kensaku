import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, jest, it, expect } from '@jest/globals';

import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';

import { faker } from '@faker-js/faker';

import { PostTypeSelect } from '../../../../sources/js/src/components/post-type-select';
import { buildOptions } from '../utils';

type ReactSelect = EntitiesSearch.PostTypeSelect<string>;

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
		value={props.value.value}
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
				value={option}
				onChange={(value) => (expectedValue = value)}
			/>
		);

		const select = screen.getByTestId('post-type-select');
		fireEvent.change(select, { target: { value: option.value } });
		expect(expectedValue).toEqual(option.value);
	});
});
