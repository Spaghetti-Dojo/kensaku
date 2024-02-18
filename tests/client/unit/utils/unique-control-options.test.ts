/**
 * External dependencies
 */
import EntitiesSearch from '@types';

import { describe, expect, it } from '@jest/globals';

/**
 * Internal dependencies
 */
import { uniqueControlOptions } from '../../../../sources/client/src/utils/unique-control-options';
import { Set } from '../../../../sources/client/src/models/set';

describe( 'Unique Control Options', () => {
	it( 'Do not allow same control options within the same set', () => {
		const set = new Set< EntitiesSearch.ControlOption< string > >( [
			{ label: 'foo', value: 'foo' },
			{ label: 'bar', value: 'bar' },
			{ label: 'foo', value: 'foo' },
			{ label: 'bar', value: 'bar' },
		] );

		expect( set.length() ).toBe( 4 );
		const uniqueSet = uniqueControlOptions( set );
		expect( uniqueSet.length() ).toBe( 2 );
		expect( uniqueSet.first()?.value ).toBe( 'foo' );
		expect( uniqueSet.last()?.value ).toBe( 'bar' );
	} );
} );
