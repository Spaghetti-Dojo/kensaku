/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import classnames from 'classnames';
import React, { JSX } from 'react';

/**
 * Internal dependencies
 */
import { useId } from '../hooks/use-id';

interface Option< V > extends EntitiesSearch.ControlOption< V > {
	readonly selectedValue: EntitiesSearch.SingularControl< V >[ 'value' ];
	readonly onChange: ( event: React.ChangeEvent< HTMLInputElement > ) => void;
}

export function RadioControl(
	props: EntitiesSearch.SingularControl< EntitiesSearch.Value > & {
		className?: string;
		id?: string;
	}
): JSX.Element {
	const className = classnames( props.className, 'wes-radio-control' );

	const onChange = ( event: React.ChangeEvent< HTMLInputElement > ) => {
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
		<div className={ className }>
			{ props.options.map( ( option ) => (
				<Option
					key={ option.value }
					label={ option.label }
					value={ option.value }
					selectedValue={ props.value }
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
			className={ `wes-radio-control-item wes-radio-control-item--${ value }` }
		>
			<label htmlFor={ id }>
				<input
					type="radio"
					id={ id }
					checked={ props.selectedValue === props.value }
					value={ value }
					onChange={ props.onChange }
				/>
				{ props.label }
			</label>
		</div>
	);
}
