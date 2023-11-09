import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, it, expect } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import { PostsSelect } from '../../../../sources/js/src/components/posts-select';
import { buildOptions } from '../utils';

describe('Posts Select', () => {
	it('call the given onChange handler', () => {
		let expectedValue: EntitiesSearch.PostsControl<string>['value'];
		const option: EntitiesSearch.ControlOption<string> = {
			label: faker.random.word(),
			value: faker.word.noun(),
		};
		const options = Set<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.merge(buildOptions());

		const rendered = render(
			<PostsSelect
				options={options}
				value={Set([option.value])}
				onChange={(value) => (expectedValue = value)}
			/>
		);

		const valuesToSelect = [option.value, String(options.last()?.value)];
		const select = rendered.container.querySelector(
			'.wz-posts-select'
		) as HTMLSelectElement;

		/*
		 * We do not need to select two options since we are only testing the pure logic not the data but,
		 * for logic correctness the `select` element is a multi select.
		 */
		userEvent.selectOptions(select, valuesToSelect);

		expect(expectedValue?.has(valuesToSelect[0] as string)).toBe(true);
		expect(expectedValue?.has(valuesToSelect[1] as string)).toBe(true);
	});
});
