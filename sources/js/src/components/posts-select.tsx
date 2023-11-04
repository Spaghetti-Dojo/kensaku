import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import AsyncSelect from 'react-select/async';

import { matchOptionValues } from '../utils/match-option-values';
import { onChangeControlOptionsHandle } from '../utils/on-change-control-options-handle';

export function PostsSelect<V>(
	props: EntitiesSearch.PostsControl<V>
): JSX.Element {
	const matchedValues = matchOptionValues(props.value, props.options);

	return (
		<AsyncSelect
			isMulti={true}
			value={matchedValues?.toArray() ?? []}
			options={props.options.toArray()}
			// @ts-ignore I think here React Select is wrong 🤔
			loadOptions={props.searchPosts}
			onChange={(options) =>
				onChangeControlOptionsHandle(props.onChange, Set(options))
			}
		/>
	);
}
