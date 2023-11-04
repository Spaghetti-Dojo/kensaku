import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import AsyncSelect from 'react-select/async';

import { buildSelectOption, searchPosts } from '../api/search-posts';
import { matchOptionValues } from '../utils/match-option-values';
import { onChangeControlOptionsHandle } from '../utils/on-change-control-options-handle';

export function PostsSelect<V, T>(
	props: EntitiesSearch.PostsControl<V, T>
): JSX.Element {
	const matchedValues = matchOptionValues(props.value, props.options);

	return (
		<AsyncSelect
			isMulti={true}
			value={matchedValues?.toArray() ?? []}
			options={props.options.toArray()}
			// @ts-ignore I think here React Select is wrong 🤔
			loadOptions={(phrase) =>
				searchPosts(props.postType, phrase).then((options) =>
					options.map(buildSelectOption)
				)
			}
			onChange={(options) =>
				onChangeControlOptionsHandle(props.onChange, Set(options))
			}
		/>
	);
}
