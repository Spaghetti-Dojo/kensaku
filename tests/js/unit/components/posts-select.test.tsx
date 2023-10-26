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
	value: Array<EntitiesSearch.Record<string>>;
};

jest.mock('react-select', () => (props: ReactSelect) => (
	<select
		multiple={true}
		id="posts-select"
		data-testid="posts-select"
		onChange={() =>
			props.onChange(
				Set([
					{
						label: faker.random.word(),
						value: faker.word.noun(),
					},
				])
			)
		}
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
	it('call the given onChange handler', () => {
		let expectedCalled: boolean = false;
		const option: EntitiesSearch.Record<string> = {
			label: faker.random.word(),
			value: faker.word.noun(),
		};
		const options = Set<EntitiesSearch.Record<string>>([])
			.add(option)
			.merge(buildOptions());

		render(
			<PostsSelect
				options={options}
				value={Set([option])}
				onChange={() => (expectedCalled = true)}
			/>
		);

		const select = screen.getByTestId('posts-select');

		/*
		 * We do not need to select two options since we are only testing the pure logic not the data but,
		 * for logic correctness the `select` element is a multi select.
		 */
		userEvent.selectOptions(select, [
			option.value,
			String(options.last()?.value),
		]);

		expect(expectedCalled).toBe(true);
	});
});
