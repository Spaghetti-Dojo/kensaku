import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import Select, { SingleValue } from 'react-select';

import { matchOptionValues } from '../utils/match-option-values';

export function PostTypeSelect<V>(
	props: EntitiesSearch.PostTypeControl<V>
): JSX.Element {
	const matchedValues = matchOptionValues(Set([props.value]), props.options);

	return (
		<Select
			isMulti={false}
			value={matchedValues?.first() ?? null}
			options={props.options.toArray()}
			onChange={(option) =>
				props.onChange(isNonNullableValue(option) ? option.value : null)
			}
		/>
	);
}

function isNonNullableValue<V>(
	value: SingleValue<
		EntitiesSearch.ControlOption<EntitiesSearch.PostTypeControl<V>['value']>
	>
): value is EntitiesSearch.ControlOption<
	NonNullable<EntitiesSearch.PostTypeControl<V>['value']>
> {
	return value !== null && value.value !== null;
}
