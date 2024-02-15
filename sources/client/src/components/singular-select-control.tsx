import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

import { NoOptionsMessage } from './no-options-message';

export function SingularSelectControl(
	props: EntitiesSearch.SingularControl<string> & {
		className?: string;
	}
): JSX.Element {
	const className = classnames(
		props.className,
		'wes-select-control',
		'wes-select-control--singular'
	);

	if (props.options.length() <= 0) {
		return <NoOptionsMessage />;
	}

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
		<select className={className} value={props?.value} onChange={onChange}>
			{props.options.map((option) => (
				<option
					key={option.value}
					className={`wes-select-control-item wes-select-control-item--${option.value}`}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</select>
	);
}
