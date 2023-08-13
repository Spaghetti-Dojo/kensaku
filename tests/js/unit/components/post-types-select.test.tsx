import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, jest, it, expect } from '@jest/globals';

import { render } from '@testing-library/react';

import { faker } from '@faker-js/faker';

import { PostTypeSelect } from '../../../../sources/js/src/components/post-type-select';

jest.mock('react-select', () => () => <div className="react-select" />);

describe('Post Types Select Component', () => {
	it('render the select to choose post types from', () => {
		let options = Set<EntitiesSearch.ControlOption<string>>([]);

		for (let count = 0; count <= 10; ++count) {
			options = options.add({
				label: faker.random.word(),
				value: faker.word.noun(),
			});
		}

		const { asFragment } = render(<PostTypeSelect options={options} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
