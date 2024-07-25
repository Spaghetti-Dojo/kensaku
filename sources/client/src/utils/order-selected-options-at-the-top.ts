/**
 * External dependencies
 */
import Kensaku from '@types';

/**
 * Internal dependencies
 */
import { Set } from '../models/set';

export function orderSelectedOptionsAtTheTop< V >(
	options: Set< Kensaku.ControlOption< V > >,
	collection: Set< V > | undefined
): Set< Kensaku.ControlOption< V > > {
	if ( options.length() <= 0 ) {
		return options;
	}
	if ( collection === undefined || collection.length() <= 0 ) {
		return options;
	}

	let _collection = new Set< Kensaku.ControlOption< V > >();
	let _options = new Set< Kensaku.ControlOption< V > >();

	options.forEach( ( option ) => {
		if ( collection.has( option.value ) ) {
			_collection = _collection.add( option );
		} else {
			_options = _options.add( option );
		}
	} );

	return _collection.concat( _options );
}
