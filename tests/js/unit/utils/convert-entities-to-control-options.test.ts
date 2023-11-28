import { OrderedSet } from 'immutable';

import { describe, it, expect } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertPostTypeEntitiesToControlOptions } from '../../../../sources/js/src/utils/convert-post-type-entities-to-control-options';

describe('Convert Entities To Control Options', () => {
	it('correctly convert entities to control options', () => {
		const entities = OrderedSet<{ slug: string; name: string }>([]);

		for (let count = 0; count <= 10; ++count) {
			entities.add({
				slug: faker.word.noun(),
				name: faker.random.word(),
			});
		}

		const options = convertPostTypeEntitiesToControlOptions(entities);
		for (const postType of entities) {
			expect(
				options.includes({ label: postType.name, value: postType.slug })
			).toEqual(true);
		}
	});

	it('returns empty list if entities set is empty', () => {
		expect(
			convertPostTypeEntitiesToControlOptions(OrderedSet([])).isEmpty()
		).toEqual(true);
	});
});
