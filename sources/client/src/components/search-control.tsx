/**
 * External dependencies
 */
import Kensaku from '@types';
import React, { JSX } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useId } from '../hooks/use-id';

export function SearchControl( props: Kensaku.SearchControl ): JSX.Element {
	const id = useId( props.id );
	const label = props.label || __( 'Search', 'kensaku' );
	const [ searchValue, setSearchValue ] = React.useState( '' );

	const onChange = ( event: React.ChangeEvent< HTMLInputElement > ) => {
		setSearchValue( event.target.value );
		props.onChange( event.target.value );
	};

	const inputProps = {
		type: 'search',
		value: searchValue,
		className: 'kensaku-search-control__input',
		onChange,
	};

	return (
		<div className="kensaku-search-control">
			<label htmlFor={ id }>
				<span className="kensaku-search-control__label">{ label }</span>
				<input id={ id } { ...inputProps } />
			</label>
		</div>
	);
}
