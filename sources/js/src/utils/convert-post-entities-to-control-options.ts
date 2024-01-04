import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { makeControlOption } from './make-control-option';

type FieldsNames = keyof EntitiesSearch.SearchEntityFields;
// TODO See if this function can be generalized. See convertEntitiesToControlOptions too.
export function convertPostEntitiesToControlOptions(
	postsEntities: OrderedSet<EntitiesSearch.SearchEntityFields>,
	labelKey: FieldsNames,
	valueKey: FieldsNames
): OrderedSet<EntitiesSearch.ControlOption<string | number>> {
	const mutableOptions = postsEntities.map((entity) => {
		const label = entity[labelKey];
		labelKeyIsString(label);
		return makeControlOption(label, entity[valueKey]);
	});

	return OrderedSet(mutableOptions);
}

function labelKeyIsString(label: unknown): asserts label is string {
	if (typeof label !== 'string') {
		throw new Error(
			'convertPostEntitiesToControlOptions: Label Key must be a string'
		);
	}
}
