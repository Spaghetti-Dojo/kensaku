import EntitiesSearch from '@types';
import React, { JSX, PropsWithChildren, useCallback } from 'react';

export function Search<V>(props: EntitiesSearch.Search<V>): JSX.Element {
	const [searchValue, setSearchValue] = React.useState<string>('');

	const Container = useCallback(
		(props: PropsWithChildren) => (
			<div className="wz-posts-control-with-search">{props.children}</div>
		),
		[props.id]
	);

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
			<Container>
				<label htmlFor={props.id}>
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
