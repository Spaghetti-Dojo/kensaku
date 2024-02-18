/**
 * External dependencies
 */
import { describe, it, expect } from '@jest/globals';

/**
 * Internal dependencies
 */
import { ImmutableRecord } from '../../../../sources/client/src/models/immutable-record';

describe( 'ImmutableRecord', () => {
	it( 'should get a value from the map', () => {
		const immutableRecord = new ImmutableRecord( { key: 'value' } );
		expect( immutableRecord.get( 'key' ) ).toBe( 'value' );
	} );

	it( 'should get a fallback value from the map', () => {
		const immutableRecord = new ImmutableRecord();
		expect( immutableRecord.get( 'key', 'fallback' ) ).toBe( 'fallback' );
	} );

	it( 'record is immutable', () => {
		const immutableRecord = new ImmutableRecord( { key: 'value' } );
		const newRecord = immutableRecord.set( 'key', 'newValue' );
		expect( newRecord.get( 'key' ) ).toBe( 'newValue' );
		expect( immutableRecord.get( 'key' ) ).toBe( 'value' );
	} );
} );
