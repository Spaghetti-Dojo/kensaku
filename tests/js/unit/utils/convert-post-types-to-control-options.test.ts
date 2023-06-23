import { EntitiesSearch } from '@entities-search-types';

import { fromPartial } from '@total-typescript/shoehorn';

import { describe, it, expect } from '@jest/globals';

import { faker } from '@faker-js/faker';

import { convertPostTypesToControlOptions } from '../../../../sources/js/src/utils/convert-post-types-to-control-options';

describe('Convert Post Types To Control Options', () => {
	it('convert post types to control options', () => {
		const postTypes = [];

		for (let count = 0; count <= 10; ++count) {
			postTypes.push(
				fromPartial<EntitiesSearch.EditablePostType>({
					viewable: true,
					slug: faker.word.noun(),
					name: faker.random.word(),
				})
			);
		}

		const options = convertPostTypesToControlOptions(postTypes);
		for (const postType of postTypes) {
			expect(
				options.findIndex((option) => option.value === postType.slug) >=
					0
			).toEqual(true);
		}
	});

	it('returns empty list if post types are empty', () => {
		expect(convertPostTypesToControlOptions([])).toEqual([]);
	});
});
