import { fromPartial } from '@total-typescript/shoehorn';
import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertPostEntitiesToControlOptions } from '../../../../sources/js/src/utils/convert-post-entities-to-control-options';

describe('Convert Entities To Control Options', () => {
	/*
	 * Convert Post Entities to Control Options
	 */
	it('correctly convert entities to control options', () => {
		const rawEntities = [];
		for (let count = 0; count < 10; ++count) {
			rawEntities.push(
				fromPartial<EntitiesSearch.PostEntityFields>({
					title: faker.word.noun(),
					id: faker.number.int(),
				})
			);
		}

		const entities =
			OrderedSet<EntitiesSearch.PostEntityFields>(rawEntities);

		const options = convertPostEntitiesToControlOptions(
			entities,
			'title',
			'id'
		).map((option) => option.value);
		for (const entity of entities) {
			expect(options.includes(entity.id)).toEqual(true);
		}
	});
});
