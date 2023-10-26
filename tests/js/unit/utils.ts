import EntitiesSearch from '@types';
import { Set } from 'immutable';

import { faker } from '@faker-js/faker';

export function buildOptions(): Set<EntitiesSearch.ControlOption<string>> {
	let options = Set<EntitiesSearch.ControlOption<string>>([]);

	for (let count = 0; count < 9; ++count) {
		options = options.add({
			label: faker.random.word(),
			value: faker.word.noun(),
		});
	}

	return options;
}
