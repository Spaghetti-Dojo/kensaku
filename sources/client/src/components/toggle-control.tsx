import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

import { slugifyOptionLabel } from '../utils/slugify-option-label';
import { NoOptionsMessage } from './no-options-message';

export function ToggleControl(
	props: EntitiesSearch.BaseControl<EntitiesSearch.Value> & {
		className?: string;
	}
): JSX.Element {
	const className = classnames(props.className, 'wz-toggle-control');

	if (props.options.length() <= 0) {
		return <NoOptionsMessage />;
	}

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;
		const valueOption = props.options.find(
			(option) => String(option.value) === target.value
		);

		if (!valueOption) {
			return;
		}

		if (target.checked) {
			props.onChange(props.value.add(valueOption.value));
			return;
		}

		props.onChange(props.value.delete(valueOption.value));
	};

	return (
		<div className={className}>
			{props.options.map((option) => {
				const value = String(option.value);
				const id = idByControlOption(option);
				return (
					<div
						key={value}
						className={`wz-toggle-control-item wz-toggle-control-item--${option.value}`}
					>
						<label htmlFor={id}>
							<input
								type="checkbox"
								id={id}
								className={`wz-toggle-control-item__input-${option.value}`}
								checked={props.value?.has(option.value)}
								value={value}
								onChange={onChange}
							/>
							{option.label}
						</label>
					</div>
				);
			})}
		</div>
	);
}

function idByControlOption<V>(
	controlOption: EntitiesSearch.ControlOption<V>
): string {
	const { value } = controlOption;
	const label = slugifyOptionLabel(controlOption);
	return `wz-toggle-control-item__input-${label}-${value}`;
}
