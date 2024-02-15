import EntitiesSearch from '@types';
import React, { JSX, PropsWithChildren, useCallback } from 'react';

import { __ } from '@wordpress/i18n';

export function SearchControl(
	props: EntitiesSearch.SearchControl
): JSX.Element {
	const [searchValue, setSearchValue] = React.useState<string>('');

	const Container = useCallback(
		(containerProps: PropsWithChildren) => (
			<div className="wes-search-control">{containerProps.children}</div>
		),
		[]
	);

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

	if (props.id) {
		return (
			<Container>
				<label htmlFor={props.id}>
					{__('Search', 'wp-entities-search')}
					<input id={props.id} {...inputProps} />
				</label>
			</Container>
		);
	}

	return (
		<Container>
			<input {...inputProps} />
		</Container>
	);
}
