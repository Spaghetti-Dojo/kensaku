import { fromPartial } from '@total-typescript/shoehorn';
import EntitiesSearch from '@types';
import { Set } from 'immutable';

import { describe, it, expect } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertPostTypesToControlOptions } from '../../../../sources/js/src/utils/convert-post-types-to-control-options';

describe('Convert Post Types To Control Options', () => {
	it('convert post types to control options', () => {
		const postTypes = Set<EntitiesSearch.PostType>([]);

		for (let count = 0; count <= 10; ++count) {
			postTypes.add(
				fromPartial<EntitiesSearch.PostType>({
					slug: faker.word.noun(),
					name: faker.random.word(),
				})
			);
		}

		const options = convertPostTypesToControlOptions(postTypes);
		for (const postType of postTypes) {
			expect(
				options.includes({ label: postType.name, value: postType.slug })
			).toEqual(true);
		}
	});

	it('returns empty list if post types are empty', () => {
		expect(convertPostTypesToControlOptions(Set([])).isEmpty()).toEqual(
			true
		);
	});
});
