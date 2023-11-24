import EntitiesSearch from '@types';
import classnames from 'classnames';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { NoOptionsMessage } from './no-options-message';

export function PostsSelect(
	props: EntitiesSearch.PostsControl<string>
): JSX.Element {
	const className = classnames(props.className, 'wz-posts-select');

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
