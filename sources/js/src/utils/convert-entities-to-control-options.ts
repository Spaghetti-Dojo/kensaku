import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { makeControlOption } from './make-control-option';

export function convertPostEntitiesToControlOptions<
	EntitiesFields extends { [p: string]: any }
>(
	entities: OrderedSet<EntitiesFields>,
	labelKey: string,
	valueKey: string
): OrderedSet<EntitiesSearch.ControlOption<string | number>> {
	const mutableOptions = entities.map((entity) => {
		const label = entity[labelKey];
		labelKeyIsString(label);
		return makeControlOption(label, entity[valueKey]);
	});

	return OrderedSet(mutableOptions);
}

function labelKeyIsString(label: unknown): asserts label is string {
	if (typeof label !== 'string') {
		throw new Error(
			'convertEntitiesToControlOptions: Label Key must be a string'
		);
	}
}
