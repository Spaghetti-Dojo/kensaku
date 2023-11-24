import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

export function PostTypeRadio(
	props: EntitiesSearch.PostTypeControl<string>
): JSX.Element {
	const className = classnames(props.className, 'wz-post-type-radio');

	return (
		<div className={className}>
			{props.options.map((option) => (
				<div key={option.value} className="wz-posts-toggle-item">
					<label htmlFor={`wz-post-type-radio-${option.value}`}>
						<input
							type="radio"
							id={`wz-post-type-radio-${option.value}`}
							checked={props.value === option.value}
							value={option.value}
							onChange={(event) =>
								props.onChange(event.target.value)
							}
						/>
						{option.label}
					</label>
				</div>
			))}
		</div>
	);
}
