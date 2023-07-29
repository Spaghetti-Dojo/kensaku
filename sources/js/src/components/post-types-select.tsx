import React, { JSX } from 'react';
import Select from 'react-select';

import EntitiesSearch from '../@types';

// TODO Make the Component able to work with different libraries (probably the best would be adding a context Provider).
export function PostTypesSelect(
	props: EntitiesSearch.PostTypeSelect
): JSX.Element | null {
	return <Select options={props.options.toArray()} />;
}
