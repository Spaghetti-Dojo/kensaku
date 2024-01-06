import EntitiesSearch from '@types';
import React, { JSX, PropsWithChildren, useCallback } from 'react';

import { __ } from '@wordpress/i18n';

export function SearchControl(
	props: EntitiesSearch.SearchControl
): JSX.Element {
	const [searchValue, setSearchValue] = React.useState<string>('');

	const Container = useCallback(
		(props: PropsWithChildren) => (
			<div className="wz-search-control">{props.children}</div>
		),
		[props.id]
	);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
		props.onChange && props.onChange(event.target.value);
	};

	const inputProps = {
		type: 'search',
		value: searchValue,
		onChange,
	};

	if (props.id) {
		return (
			<Container>
				<label htmlFor={props.id}>
					{__('Search', 'wz-entities-search')}
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
