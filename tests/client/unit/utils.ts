/**
 * External dependencies
 */
import Kensaku from '@types';

import { faker } from '@faker-js/faker';

/**
 * Internal dependencies
 */
import { Set } from '../../../sources/client/src/models/set';

export function buildOptions(): Set< Kensaku.ControlOption< string > > {
	let options = new Set< Kensaku.ControlOption< string > >();

	for ( let count = 0; count < 9; ++count ) {
		options = options.add( {
			label: faker.word.words( 2 ),
			value: faker.word.noun(),
		} );
	}

	return options;
}
