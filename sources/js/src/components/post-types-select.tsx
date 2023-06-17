import { EntitiesSearch } from '@entities-search-types';
import React, { JSX } from 'react';
import Select from 'react-select';

export function PostTypesSelect(
	props: EntitiesSearch.PostTypeSelect
): JSX.Element | null {
	return <Select options={props.options} />;
}
