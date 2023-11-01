import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import Select from 'react-select';

import { matchOptionValues } from '../utils/match-option-values';
import { onChangeControlOptionsHandle } from '../utils/on-change-control-options-handle';

export function PostsSelect<V>(
	props: EntitiesSearch.PostsControl<V>
): JSX.Element {
	const matchedValues = matchOptionValues(props.value, props.options);

	return (
		<Select
			isMulti={true}
			value={matchedValues?.toArray() ?? []}
			options={props.options.toArray()}
			onChange={(options) =>
				onChangeControlOptionsHandle(props.onChange, Set(options))
			}
		/>
	);
}
