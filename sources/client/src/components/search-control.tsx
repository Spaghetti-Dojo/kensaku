/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import React, { JSX } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { useId } from '../hooks/use-id';

export function SearchControl(
	props: EntitiesSearch.SearchControl
): JSX.Element {
	const id = useId(props.id);
	const label = props.label || __('Search', 'wp-entities-search');
	const [searchValue, setSearchValue] = React.useState('');

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
		props.onChange(event.target.value);
	};

	const inputProps = {
		type: 'search',
		value: searchValue,
		className: 'wes-search-control__input',
		onChange,
	};

	return (
		<div className="wes-search-control">
			<label htmlFor={id}>
				<span className="wes-search-control__label">{label}</span>
				<input id={id} {...inputProps} />
			</label>
		</div>
	);
}
