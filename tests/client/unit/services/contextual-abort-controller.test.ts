/**
 * External dependencies
 */
import { afterEach, beforeEach, describe, it, expect } from '@jest/globals';

/**
 * Internal dependencies
 */
import { ContextualAbortController } from '../../../../sources/client/src/services/contextual-abort-controller';

describe( 'ContextualAbortController', () => {
	let controller: ContextualAbortController;

	beforeEach( () => {
		controller = new ContextualAbortController(
			'testContext',
			'testReason'
		);
	} );

	afterEach( () => {
		controller.abort();
	} );

	it( 'should create a new instance of ContextualAbortController', () => {
		expect( controller ).toBeInstanceOf( ContextualAbortController );
	} );

	it( 'should return the correct context', () => {
		expect( controller.context() ).toBe( 'testContext' );
	} );

	it( 'should abort the controller', () => {
		controller.abort();
		expect( controller.isAborted() ).toBe( true );
	} );

	it( 'should return the correct signal', () => {
		const signal = controller.signal();
		expect( signal ).toBeInstanceOf( AbortSignal );
	} );

	it( 'should return the correct aborted state', () => {
		expect( controller.isAborted() ).toBe( false );
		controller.abort();
		expect( controller.isAborted() ).toBe( true );
	} );

	it( 'should throw an error if the context is empty', () => {
		expect(
			() => new ContextualAbortController( '', 'testReason' )
		).toThrowError( 'Abort Controllers, context cannot be empty' );
	} );
} );
