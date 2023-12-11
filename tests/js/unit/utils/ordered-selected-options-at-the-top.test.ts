import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { orderSelectedOptionsAtTheTop } from '../../../../sources/js/src/utils/order-selected-options-at-the-top';

describe('Ordered Selected Options at the Top', () => {
	/*
	 * Given options are always re-ordered to includes the given collection values at the top
	 */
	function generateOptions(): Array<EntitiesSearch.ControlOption<string>> {
		const options: Array<EntitiesSearch.ControlOption<string>> = [];

		for (let i = 1; i <= 10; i++) {
			options.push({
				value: `${i}`,
				label: `Option ${i}`,
			});
		}

		return options;
	}

	function generateRandomNumbersAsStringCollection(): Array<string> {
		const collection: Array<string> = [];

		for (let count = 1; count <= 4; count++) {
			const number = faker.number.int({ min: 1, max: 10 });

			if (collection.includes(`${number}`)) {
				count = 1;
				continue;
			}

			collection.push(`${number}`);
		}

		return collection.slice(0, 4);
	}

	it('should return the given options at the top', () => {
		const rawCollection = generateRandomNumbersAsStringCollection();

		const collection = OrderedSet(rawCollection);
		const options = OrderedSet(generateOptions());

		const result = orderSelectedOptionsAtTheTop(options, collection)
			.slice(0, 4)
			.toArray()
			.map((option) => option.value);

		if (rawCollection.length < 4) {
			throw new Error('The collection must have at least 4 values');
		}

		expect(result.includes(`${rawCollection[0]}`)).toEqual(true);
		expect(result.includes(`${rawCollection[1]}`)).toEqual(true);
		expect(result.includes(`${rawCollection[2]}`)).toEqual(true);
		expect(result.includes(`${rawCollection[3]}`)).toEqual(true);
	});

	it('should return the given selected options when the collection is empty', () => {
		const options = OrderedSet<EntitiesSearch.ControlOption<string>>(
			generateOptions()
		);

		const result = orderSelectedOptionsAtTheTop(
			options,
			OrderedSet<string>()
		);

		expect(result).toBe(options);
	});

	it('should return the given options when the options are empty', () => {
		const options = OrderedSet<EntitiesSearch.ControlOption<string>>();

		const result = orderSelectedOptionsAtTheTop(
			options,
			OrderedSet<string>()
		);

		expect(result.isEmpty()).toEqual(true);
	});
});
