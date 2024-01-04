import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React from 'react';

import { describe, it, expect } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import { KindSelectControl } from '../../../../sources/js/src/components/kind-select-control';
import { buildOptions } from '../utils';

describe('Post Types Select', () => {
	/*
	 * We want to ensure the internal logic of the component works as expected, we're not interested
	 * in the React Select component, so we mock it.
	 */
	it('call the given onChange handler', (done) => {
		let expectedValue: EntitiesSearch.KindControl<string>['value'] = '';
		const option: EntitiesSearch.ControlOption<string> = {
			label: faker.word.words(2),
			value: faker.word.noun(),
		};
		const options = OrderedSet<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.merge(buildOptions());

		const rendered = render(
			<KindSelectControl
				options={options}
				value={option.value}
				onChange={(value) => (expectedValue = value)}
			/>
		);

		const select = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		userEvent.selectOptions(select, option.value).then(() => {
			expect(expectedValue).toBe(option.value);
			done();
		});
	});
});
