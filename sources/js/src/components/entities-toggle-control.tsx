import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

import { NoOptionsMessage } from './no-options-message';

export function EntitiesToggleControl(
	props: EntitiesSearch.EntitiesControl<number>
): JSX.Element {
	const className = classnames(
		props.className,
		'wz-toggle-control',
		'wz-toggle-control--entities'
	);

	if (props.options.size <= 0) {
		return <NoOptionsMessage />;
	}

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;

		if (!(target instanceof HTMLInputElement)) {
			return;
		}

		const value = Number(target.value);

		if (target.checked && !props.value?.has(value)) {
			props.onChange(props.value?.add(value));
			return;
		}

		props.onChange(props.value?.delete(value));
	};

	return (
		<div className={className}>
			{props.options.map((option) => (
				<div key={option.value} className="wz-toggle-control-item">
					<label
						htmlFor={`wz-toggle-control-item__input-${option.value}`}
					>
						<input
							type="checkbox"
							id={`wz-toggle-control-item__input-${option.value}`}
							checked={props.value?.has(option.value)}
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
