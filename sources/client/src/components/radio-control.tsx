import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

import { useId } from '../hooks/use-id';

export function RadioControl(
	props: EntitiesSearch.SingularControl<EntitiesSearch.Value> & {
		className?: string;
		id?: string;
	}
): JSX.Element {
	const id = useId(props.id);
	const className = classnames(props.className, 'wes-radio-control');

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
					className={`wes-radio-control-item wes-radio-control-item--${option.value}`}
				>
					<label htmlFor={id}>
						<input
							type="radio"
							id={id}
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
