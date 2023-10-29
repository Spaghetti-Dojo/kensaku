import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import Select, { SingleValue } from 'react-select';

import { matchOptionValues } from '../utils/match-option-values';
import { onChangeControlOptionsHandle } from '../utils/on-change-control-options-handle';

export function PostTypeSelect<V>(
	props: EntitiesSearch.PostTypeSelect<V>
): JSX.Element | null {
	const matchedValues = matchOptionValues(Set([props.value]), props.options);

	const onChange = (values: Set<V> | null) =>
		props.onChange(values?.first() ?? null);

	return (
		<Select
			isMulti={false}
			value={matchedValues?.first() ?? null}
			options={props.options.toArray()}
			onChange={(options) => {
				if (isNonNullableValue(options)) {
					onChange(null);
					return;
				}

				onChangeControlOptionsHandle(
					onChange,
					Set(options ? [options] : [])
				);
			}}
		/>
	);
}

function isNonNullableValue<V>(
	value: SingleValue<EntitiesSearch.ControlOption<V>>
): value is NonNullable<EntitiesSearch.ControlOption<V>> {
	return value !== null && value.value !== null;
}
