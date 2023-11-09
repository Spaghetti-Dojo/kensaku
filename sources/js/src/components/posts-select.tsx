import EntitiesSearch from '@types';
import classnames from 'classnames';
import { Set } from 'immutable';
import React, { JSX } from 'react';

export function PostsSelect(
	props: EntitiesSearch.PostsControl<string>
): JSX.Element {
	const className = classnames(props.className, 'wz-posts-select');

	return (
		<select
			multiple
			className={className}
			value={props?.value?.toArray()}
			onChange={(event) => {
				const values = Array.from(event.target.options)
					.filter((option) => option.selected)
					.map((option) => option.value);

				props.onChange(Set(values));
			}}
		>
			{props.options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}
