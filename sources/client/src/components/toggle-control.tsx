import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

import { slugifyOptionLabel } from '../utils/slugify-option-label';
import { NoOptionsMessage } from './no-options-message';

export function ToggleControl(
	props: EntitiesSearch.BaseControl<string> & { className?: string }
): JSX.Element {
	const className = classnames(props.className, 'wz-toggle-control');

	if (props.options.length() <= 0) {
		return <NoOptionsMessage />;
	}

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;

		if (target.checked && !props.value.has(target.value)) {
			props.onChange(props.value.add(target.value));
			return;
		}

		props.onChange(props.value.delete(target.value));
	};

	return (
		<div className={className}>
			{props.options.map((option) => {
				const id = idByControlOption(option);
				return (
					<div key={option.value} className="wz-toggle-control-item">
						<label htmlFor={id}>
							<input
								type="checkbox"
								id={id}
								checked={props.value?.has(option.value)}
								value={option.value}
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
