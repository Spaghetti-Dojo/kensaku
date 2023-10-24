import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, jest, it, expect } from '@jest/globals';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import { PostsSelect } from '../../../../sources/js/src/components/posts-select';
import { buildOptions } from '../utils';

type ReactSelect = EntitiesSearch.PostsSelect<string> & {
	value: Array<EntitiesSearch.ControlOption<string>>;
};

jest.mock('react-select', () => (props: ReactSelect) => (
	<select
		multiple={true}
		id="posts-select"
		data-testid="posts-select"
		onChange={() => props.onChange('onChange Called')}
		className="react-select"
	>
		{props.options.map((option: any) => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</select>
));

describe('Posts Select', () => {
	it('change the value when the use select one or', () => {
		let expectedCalled: boolean = false;
		const option = {
			label: faker.random.word(),
			value: faker.word.noun(),
		};
		const options = Set<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.merge(buildOptions());

		render(
			<PostsSelect
				options={options}
				values={Set([option])}
				onChange={() => {
					expectedCalled = true;
				}}
			/>
		);

		const select = screen.getByTestId('posts-select');

		userEvent.selectOptions(select, [
			option.value,
			String(options.last()?.value),
		]);

		expect(screen.getByText<HTMLOptionElement>(option.label).selected).toBe(
			true
		);
		expect(
			screen.getByText<HTMLOptionElement>(String(options.last()?.label))
				.selected
		).toBe(true);

		expect(expectedCalled).toBe(true);
	});
});
