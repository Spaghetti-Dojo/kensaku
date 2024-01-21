import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

export function RadioControl(
	props: EntitiesSearch.SingularControl<string> & { className?: string }
): JSX.Element {
	const className = classnames(props.className, 'wz-radio-control');

	return (
		<div className={className}>
			{props.options.map((option) => (
				<div
					key={option.value}
					className={`wz-radio-control-item wz-radio-control-item--${option.value}`}
				>
					<label
						htmlFor={`wz-radio-control-item__input-${option.value}`}
					>
						<input
							type="radio"
							id={`wz-radio-control-item__input-${option.value}`}
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
