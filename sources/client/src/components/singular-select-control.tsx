/**
 * External dependencies
 */
import Kensaku from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

/**
 * Internal dependencies
 */
import { NoOptionsMessage } from './no-options-message';

export function SingularSelectControl(
	props: Kensaku.SingularControl< string > & {
		className?: string;
	}
): JSX.Element {
	const className = classnames(
		props.className,
		'kensaku-select-control',
		'kensaku-select-control--singular'
	);

	if ( props.options.length() <= 0 ) {
		return <NoOptionsMessage />;
	}

	const onChange = ( event: React.ChangeEvent< HTMLSelectElement > ) => {
		const { target } = event;
		const valueOption = props.options.find(
			( option ) => String( option.value ) === target.value
		);

		if ( ! valueOption ) {
			return;
		}

		props.onChange( valueOption.value );
	};

	return (
		<select
			className={ className }
			value={ props?.value }
			onChange={ onChange }
		>
			{ props.options.map( ( option ) => (
				<option
					key={ option.value }
					className={ `kensaku-select-control-item kensaku-select-control-item--${ option.value }` }
					value={ option.value }
				>
					{ option.label }
				</option>
			) ) }
		</select>
	);
}
