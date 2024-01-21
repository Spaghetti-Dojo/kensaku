import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

import { Set } from '../vo/set';
import { NoOptionsMessage } from './no-options-message';

export function PluralSelectControl(
	props: EntitiesSearch.BaseControl<string> & {
		className?: string;
	}
): JSX.Element {
	const [selected, setSelected] = React.useState(props.value);
	const className = classnames(
		props.className,
		'wz-select-control',
		'wz-select-control--plural'
	);

	if (props.options.length() <= 0) {
		return <NoOptionsMessage />;
	}

	return (
		<select
			multiple
			className={className}
			value={selected.toArray()}
			onChange={(event) => {
				if (event.target.selectedOptions.length <= 0) {
					props.onChange(new Set());
				}

				const selectedValues = Array.from(
					event.target.selectedOptions
				).map((option) => option.value);

				setSelected(new Set(selectedValues));
				props.onChange(new Set(selectedValues));
			}}
		>
			{props.options.map((option) => (
				<option
					key={option.value}
					className={`wz-select-control-item wz-select-control-item--${option.value}`}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</select>
	);
}
