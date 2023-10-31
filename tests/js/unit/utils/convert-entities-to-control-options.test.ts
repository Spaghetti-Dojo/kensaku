import { Set } from 'immutable';

import { describe, it, expect } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertEntitiesToControlOptions } from '../../../../sources/js/src/utils/convert-entities-to-control-options';

describe('Convert Entities To Control Options', () => {
	it('correctly convert entities to control options', () => {
		const entities = Set<{ slug: string; name: string }>([]);

		for (let count = 0; count <= 10; ++count) {
			entities.add({
				slug: faker.word.noun(),
				name: faker.random.word(),
			});
		}

		const options = convertEntitiesToControlOptions(entities);
		for (const postType of entities) {
			expect(
				options.includes({ label: postType.name, value: postType.slug })
			).toEqual(true);
		}
	});

	it('returns empty list if entities set is empty', () => {
		expect(convertEntitiesToControlOptions(Set([])).isEmpty()).toEqual(
			true
		);
	});
});
