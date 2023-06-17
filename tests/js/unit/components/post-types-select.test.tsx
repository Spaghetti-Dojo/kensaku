import { PostTypesSelect } from '../../../../sources/js/src/components/post-types-select';
import { EntitiesSearch } from '@entities-search-types';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import React from 'react';

describe('Post Types Select Component', () => {
	it('render the select to choose post types from', () => {
		const options: EntitiesSearch.PostTypeSelect['options'] = [];

		for (let count = 0; count <= 10; ++count) {
			options.push({
				label: faker.random.word(),
				value: faker.word.noun(),
			});
		}

		const { asFragment } = render(<PostTypesSelect options={options} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
