import EntitiesSearch from '@types';

import { ControlOption } from '../vo/control-option';
import { Set } from '../vo/set';
import { assert } from './assert';

export function convertEntitiesToControlOptions<
	V,
	EntitiesFields extends { [p: string]: any }
>(
	entities: Set<EntitiesFields>,
	labelKey: string,
	valueKey: string
): Set<EntitiesSearch.ControlOption<V>> {
	return entities.map((entity) => {
		const label = entity[labelKey];
		const value = entity[valueKey];
		assert(typeof label === 'string', 'Label Key must be a string');
		return new ControlOption(label, value);
	});
}
