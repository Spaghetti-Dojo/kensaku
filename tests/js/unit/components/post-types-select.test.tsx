import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, jest, it, expect } from '@jest/globals';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import { PostTypeSelect } from '../../../../sources/js/src/components/post-type-select';
import { buildOptions } from '../utils';

type ReactSelect = EntitiesSearch.PostTypeSelect<string>;

jest.mock('react-select', () => (props: ReactSelect) => (
	<select
		id="post-type-select"
		data-testid="post-type-select"
		onChange={() =>
			props.onChange({
				label: faker.random.word(),
				value: faker.word.noun(),
			})
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

describe('Post Types Select', () => {
	/*
	 * We want to ensure the internal logic of the component works as expected, we're not interested
	 * in the React Select component, so we mock it.
	 */
	it('call the given onChange handler', (done) => {
		let expectedCalled: boolean = false;
		const option: EntitiesSearch.Record<string> = {
			label: faker.random.word(),
			value: faker.word.noun(),
		};
		const options = Set<EntitiesSearch.Record<string>>([])
			.add(option)
			.merge(buildOptions());

		render(
			<PostTypeSelect
				options={options}
				value={option}
				onChange={() => (expectedCalled = true)}
			/>
		);

		const select = screen.getByTestId('post-type-select');

		userEvent.selectOptions(select, option.value).then(() => {
			expect(expectedCalled).toBe(true);
			done();
		});
	});
});
