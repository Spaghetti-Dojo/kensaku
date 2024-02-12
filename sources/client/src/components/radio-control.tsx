import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

export function RadioControl(
	props: EntitiesSearch.SingularControl<EntitiesSearch.Value> & {
		className?: string;
	}
): JSX.Element {
	const className = classnames(props.className, 'wz-radio-control');

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;
		const valueOption = props.options.find(
			(option) => String(option.value) === target.value
		);

		if (!valueOption) {
			return;
		}

		props.onChange(valueOption.value);
	};

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
							onChange={onChange}
						/>
						{option.label}
					</label>
				</div>
			))}
		</div>
	);
}
