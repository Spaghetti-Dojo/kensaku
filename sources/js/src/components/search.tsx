import EntitiesSearch from '@types';
import React, { JSX } from 'react';

export function Search<V>(props: EntitiesSearch.Search<V>): JSX.Element {
	const [searchValue, setSearchValue] = React.useState<string>('');

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
		props.search && props.search(event.target.value);
	};

	const inputProps = {
		type: 'search',
		value: searchValue,
		onChange,
	};

	if (props.id) {
		return (
			<label htmlFor={props.id}>
				<input id={props.id} {...inputProps} />
			</label>
		);
	}

	return (
		<div className="wz-posts-control-with-search">
			<input {...inputProps} />
		</div>
	);
}
