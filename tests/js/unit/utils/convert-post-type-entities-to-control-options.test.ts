import { fromPartial } from '@total-typescript/shoehorn';
import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { describe, it, expect } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertPostTypeEntitiesToControlOptions } from '../../../../sources/js/src/utils/convert-post-type-entities-to-control-options';

describe('Convert Entities To Control Options', () => {
	it('correctly convert entities to control options', () => {
		const rawEntities = [];
		for (let count = 0; count < 10; ++count) {
			rawEntities.push(
				fromPartial<EntitiesSearch.PostType>({
					slug: faker.word.noun(),
					name: faker.word.noun(),
				})
			);
		}

		const entities = OrderedSet(rawEntities);

		const options = convertPostTypeEntitiesToControlOptions(entities).map(
			(option) => option.value
		);
		for (const postType of entities) {
			expect(options.includes(postType.slug)).toEqual(true);
		}
	});

	it('returns empty list if entities set is empty', () => {
		expect(
			convertPostTypeEntitiesToControlOptions(OrderedSet([])).isEmpty()
		).toEqual(true);
	});
});
