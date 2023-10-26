import EntitiesSearch from '@types';
import React, { JSX } from 'react';
import Select from 'react-select';

export function PostTypeSelect<V>(
	props: EntitiesSearch.PostTypeSelect<V>
): JSX.Element | null {
	return (
		<Select
			isMulti={false}
			value={props.value}
			options={props.options.toArray()}
			onChange={props.onChange}
		/>
	);
}
