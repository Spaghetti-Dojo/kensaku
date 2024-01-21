import { describe, expect, it } from '@jest/globals';

import { makeInitialState } from '../../../../sources/client/src/storage/entities/initial-state';

describe('Initial state', () => {
	it('ensure all options are empty', () => {
		const initialState = makeInitialState({});
		expect(initialState.contextualEntitiesOptions.length()).toBe(0);
		expect(initialState.currentEntitiesOptions.length()).toBe(0);
		expect(initialState.selectedEntitiesOptions.length()).toBe(0);
	});
});
