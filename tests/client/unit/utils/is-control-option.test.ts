/**
 * External dependencies
 */
import { describe, expect, it } from '@jest/globals';

/**
 * Internal dependencies
 */
import { isControlOption } from '../../../../sources/client/src/utils/is-control-option';

describe( 'isControlOption', () => {
	it( 'shall return true when given object is of type of ControlOption', () => {
		expect( isControlOption( { label: 'label', value: 'value' } ) ).toBe(
			true
		);
	} );

	describe.each( [
		{ label: 1, value: 1 },
		{},
		null,
		undefined,
		1,
		'string',
	] )( '%#:%s', ( maybeControlOption ) => {
		it( 'shall return false when given object is not of type of ControlOption:', () => {
			expect( isControlOption( maybeControlOption ) ).toBe( false );
		} );
	} );
} );
