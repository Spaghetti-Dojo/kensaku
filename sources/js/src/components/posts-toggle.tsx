import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

export function PostsToggle(
	props: EntitiesSearch.PostsControl<number>
): JSX.Element {
	const className = classnames(props.className, 'wz-posts-toggle');

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
				<div key={option.value} className="wz-posts-toggle-item">
					<label>
						<input
							type="checkbox"
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
