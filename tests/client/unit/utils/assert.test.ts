/**
 * External dependencies
 */
import { expect, it, describe } from '@jest/globals';

/**
 * Internal dependencies
 */
import { assert } from '../../../../sources/client/src/utils/assert';

describe( 'assert', () => {
	it( 'should throw an error if the condition is false', () => {
		expect( () => assert( false, 'Failed' ) ).toThrow();
	} );

	it( 'should not throw an error if the condition is true', () => {
		expect( () => assert( true, 'Failed' ) ).not.toThrow();
	} );
} );
