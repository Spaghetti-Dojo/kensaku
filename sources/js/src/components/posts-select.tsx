import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import Select from 'react-select';

export function PostsSelect<V>(
	props: EntitiesSearch.PostsSelect<V>
): JSX.Element | null {
	return (
		<Select
			isMulti={true}
			value={props.value?.toArray()}
			options={props.options.toArray()}
			onChange={(options) =>
				props.onChange(options.length <= 0 ? null : Set(options))
			}
		/>
	);
}
