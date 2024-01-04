import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

export function KindSelectControl(
	props: EntitiesSearch.KindControl<string>
): JSX.Element {
	const className = classnames(
		props.className,
		'wz-select-control',
		'wz-select-control--kind'
	);

	return (
		<select
			className={className}
			value={props.value}
			onChange={(event) => props.onChange(event.target.value)}
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
