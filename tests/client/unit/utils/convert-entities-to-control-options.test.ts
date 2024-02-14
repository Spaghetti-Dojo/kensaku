import { fromPartial } from '@total-typescript/shoehorn';
import EntitiesSearch from '@types';

import { describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertEntitiesToControlOptions } from '../../../../sources/client/src/utils/convert-entities-to-control-options';
import { Set } from '../../../../sources/client/src/vo/set';

describe('Convert Entities To Control Options', () => {
	it('correctly convert entities to control options', () => {
		const rawEntities = [];
		for (let count = 0; count < 10; ++count) {
			rawEntities.push(
				fromPartial<EntitiesSearch.SearchEntityFields>({
					title: faker.word.noun(),
					id: faker.number.int(),
				})
			);
		}

		const entities = new Set<EntitiesSearch.SearchEntityFields>(
			rawEntities
		);

		const options = convertEntitiesToControlOptions(
			entities,
			'title',
			'id'
		).map((option) => option.value);
		for (const entity of entities) {
			expect(options.has(entity.id)).toEqual(true);
		}
	});

	it('throws an error if the option label is not a string', () => {
		const rawEntities = [];
		for (let count = 0; count < 10; ++count) {
			rawEntities.push(
				fromPartial<EntitiesSearch.SearchEntityFields>({
					title: faker.word.noun(),
					id: faker.number.int(),
				})
			);
		}

		const entities = new Set<EntitiesSearch.SearchEntityFields>(
			rawEntities
		);

		expect(() => {
			// To make the test fail, we pass the id as the label key
			convertEntitiesToControlOptions(entities, 'id', 'id');
		}).toThrow();
	});
});
