import EntitiesSearch from '@types';

import { Set } from '../vo/set';
import { makeControlOption } from './make-control-option';

export function convertEntitiesToControlOptions<
	EntitiesFields extends { [p: string]: any }
>(
	entities: Set<EntitiesFields>,
	labelKey: string,
	valueKey: string
): Set<EntitiesSearch.ControlOption<string>> {
	return entities.map((entity) => {
		const label = entity[labelKey];
		const value = entity[valueKey];
		labelKeyIsString(label);
		return makeControlOption(label, String(value));
	});
}

function labelKeyIsString(label: unknown): asserts label is string {
	if (typeof label !== 'string') {
		throw new Error(
			'convertEntitiesToControlOptions: Label Key must be a string'
		);
	}
}
