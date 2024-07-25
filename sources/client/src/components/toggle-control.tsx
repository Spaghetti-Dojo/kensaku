/**
 * External dependencies
 */
import Kensaku from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

/**
 * Internal dependencies
 */
import { useId } from '../hooks/use-id';
import { NoOptionsMessage } from './no-options-message';

interface Option< V > extends Kensaku.ControlOption< V > {
	readonly selectedValues: Kensaku.BaseControl< V >[ 'value' ];
	readonly onChange: ( event: React.ChangeEvent< HTMLInputElement > ) => void;
}

export function ToggleControl(
	props: Kensaku.BaseControl< Kensaku.Value > & {
		className?: string;
	}
): JSX.Element {
	const className = classnames( props.className, 'kensaku-toggle-control' );

	if ( props.options.length() <= 0 ) {
		return <NoOptionsMessage />;
	}

	const onChange = ( event: React.ChangeEvent< HTMLInputElement > ) => {
		const { target } = event;
		const valueOption = props.options.find(
			( option ) => String( option.value ) === target.value
		);

		if ( ! valueOption ) {
			return;
		}

		if ( target.checked ) {
			props.onChange( props.value.add( valueOption.value ) );
			return;
		}

		props.onChange( props.value.delete( valueOption.value ) );
	};

	return (
		<div className={ className }>
			{ props.options.map( ( option ) => (
				<Option< Kensaku.Value >
					key={ option.value }
					label={ option.label }
					value={ option.value }
					selectedValues={ props.value }
					onChange={ onChange }
				/>
			) ) }
		</div>
	);
}

function Option< V >( props: Option< V > ): JSX.Element {
	const id = useId();
	const value = String( props.value );

	return (
		<div
			className={ `kensaku-toggle-control-item kensaku-toggle-control-item--${ value }` }
		>
			<label htmlFor={ id }>
				<input
					type="checkbox"
					id={ id }
					className={ `kensaku-toggle-control-item__input-${ value }` }
					checked={ props.selectedValues?.has( props.value ) }
					value={ value }
					onChange={ props.onChange }
				/>
				{ props.label }
			</label>
		</div>
	);
}
