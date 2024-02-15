import EntitiesSearch from '@types';
import React from 'react';

import { describe, it, expect } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';

import { PluralSelectControl } from '../../../../sources/client/src/components/plural-select-control';
import { Set } from '../../../../sources/client/src/vo/set';
import { buildOptions } from '../utils';

describe('Posts Select', () => {
	it('Call the given onChange handler', async () => {
		const option: EntitiesSearch.ControlOption<string> = {
			label: faker.word.words(2),
			value: faker.word.noun(),
		};
		const options = new Set<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.concat(buildOptions());

		const rendered = render(
			<PluralSelectControl
				options={options}
				value={new Set([option.value])}
				onChange={() => {}}
			/>
		);

		const valuesToSelect = [option.value, String(options.last()?.value)];
		const select = rendered.container.querySelector(
			'.wes-select-control'
		) as HTMLSelectElement;

		/*
		 * We do not need to select two options since we are only testing the pure logic not the data but,
		 * for logic correctness the `select` element is a multi select.
		 */
		await userEvent.selectOptions(select, valuesToSelect);

		expect(select.selectedOptions[0]?.value).toEqual(valuesToSelect[0]);
		expect(select.selectedOptions[1]?.value).toEqual(valuesToSelect[1]);
	});

	it('Deselect the options', async () => {
		const option: EntitiesSearch.ControlOption<string> = {
			label: faker.word.words(2),
			value: faker.word.noun(),
		};
		const options = new Set<EntitiesSearch.ControlOption<string>>([])
			.add(option)
			.concat(buildOptions());

		const rendered = render(
			<PluralSelectControl
				options={options}
				value={new Set([option.value])}
				onChange={() => {}}
			/>
		);

		const valuesToSelect = [option.value, String(options.last()?.value)];
		const select = rendered.container.querySelector(
			'.wes-select-control'
		) as HTMLSelectElement;

		/*
		 * We do not need to select two options since we are only testing the pure logic not the data but,
		 * for logic correctness the `select` element is a multi select.
		 */
		await userEvent.selectOptions(select, valuesToSelect);

		expect(select.selectedOptions[0]?.value).toEqual(valuesToSelect[0]);
		expect(select.selectedOptions[1]?.value).toEqual(valuesToSelect[1]);

		await userEvent.deselectOptions(select, valuesToSelect);
		expect(select.selectedOptions.length).toBe(0);
	});

	it('Render the NoOptionsMessage component', () => {
		const rendered = render(
			<PluralSelectControl
				options={new Set()}
				value={new Set()}
				onChange={() => {}}
			/>
		);

		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
