/**
 * External dependencies
 */
import Kensaku from '@types';

/**
 * Internal dependencies
 */
import { Set } from '../models/set';

// TODO Is this necessary due the new Set implementation?
export function uniqueControlOptions< V >(
	set: Set< Kensaku.ControlOption< V > >
): Set< Kensaku.ControlOption< V > > {
	let uniqueOptions = new Set< Kensaku.ControlOption< V > >();
	const temp: Array< Kensaku.ControlOption< V >[ 'value' ] > = [];

	for ( const option of set ) {
		if ( ! temp.includes( option.value ) ) {
			uniqueOptions = uniqueOptions.add( option );
		}

		temp.push( option.value );
	}

	return uniqueOptions;
}
