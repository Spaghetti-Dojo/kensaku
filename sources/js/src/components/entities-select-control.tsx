import EntitiesSearch from '@types';
import classnames from 'classnames';
import { OrderedSet } from 'immutable';
import React, { JSX } from 'react';

import { NoOptionsMessage } from './no-options-message';

// TODO Must accept string or number? because the value might be the ID of the posts.
// TODO Add className property to the other related components
export function EntitiesSelectControl(
	props: EntitiesSearch.EntitiesControl<string>
): JSX.Element {
	const className = classnames(
		props.className,
		'wz-select-control',
		'wz-select-control--entities'
	);

	if (props.options.size <= 0) {
		return <NoOptionsMessage />;
	}

	return (
		<select
			multiple
			className={className}
			value={props?.value?.toArray()}
			onChange={(event) => {
				const values = Array.from(event.target.options)
					.filter((option) => option.selected)
					.map((option) => option.value);

				props.onChange(OrderedSet(values));
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
