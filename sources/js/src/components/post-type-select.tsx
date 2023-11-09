import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

export function PostTypeSelect(
	props: EntitiesSearch.PostTypeControl<string>
): JSX.Element {
	const className = classnames(props.className, 'wz-post-type-select');
	return (
		<select
			className={className}
			value={props.value}
			onChange={(event) => props.onChange(event.target.value)}
		>
			{props.options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}
