import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';
import Select from 'react-select';

import { isControlOption } from '../utils/is-control-option';

export function PostsSelect<V>(
	props: EntitiesSearch.PostsSelect<V>
): JSX.Element | null {
	return (
		<Select
			isMulti={true}
			value={props.value?.toArray()}
			options={props.options.toArray()}
			onChange={(options) => {
				props.onChange(Set(options.filter(isControlOption)));
			}}
		/>
	);
}
