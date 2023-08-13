import EntitiesSearch from '@types';
import React, { JSX } from 'react';
import Select from 'react-select';
import type { Props } from 'react-select';

type SelectPropsWithoutOptions = Omit<
	Props<
		EntitiesSearch.ControlOption<EntitiesSearch.PostTypeSelect['value']>,
		false
	>,
	keyof EntitiesSearch.PostTypeSelect | 'isMulti' | 'option'
>;

interface PostTypeSelectProps
	extends EntitiesSearch.PostTypeSelect,
		SelectPropsWithoutOptions {}

export function PostTypesSelect(
	props: PostTypeSelectProps
): JSX.Element | null {
	const value = props.options.find((option) => option.value === props.value);

	return (
		<Select
			{...props}
			isMulti={false}
			value={value ?? props.defaultValue ?? props.options.first() ?? null}
			options={props.options.toArray()}
			onChange={(opt) => props.onChange(opt?.value ?? null)}
		/>
	);
}
