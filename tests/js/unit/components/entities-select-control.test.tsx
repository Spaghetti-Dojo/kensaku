import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React from 'react';

import { describe, it, expect } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import { EntitiesSelectControl } from '../../../../sources/js/src/components/entities-select-control';
import { buildOptions } from '../utils';

describe('Posts Select', () => {
	it('call the given onChange handler', async () => {
		let expectedValue: EntitiesSearch.EntitiesControl<string>['value'];
		const option: EntitiesSearch.ControlOption<string> = {
			label: faker.word.words(2),
			value: faker.word.noun(),
		};
		const options = OrderedSet<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.merge(buildOptions());

		const rendered = render(
			<EntitiesSelectControl
				options={options}
				value={OrderedSet([option.value])}
				onChange={(value) => (expectedValue = value)}
			/>
		);

		const valuesToSelect = [option.value, String(options.last()?.value)];
		const select = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		/*
		 * We do not need to select two options since we are only testing the pure logic not the data but,
		 * for logic correctness the `select` element is a multi select.
		 */
		await userEvent.selectOptions(select, valuesToSelect);

		expect(expectedValue?.has(valuesToSelect[0] as string)).toBe(true);
		expect(expectedValue?.has(valuesToSelect[1] as string)).toBe(true);
	});
});
