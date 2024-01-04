import { describe, expect, it } from '@jest/globals';

import { makeInitialState } from '../../../../sources/js/src/storage/entities/initial-state';

describe('Initial state', () => {
	it('ensure all options are empty', () => {
		const initialState = makeInitialState();
		expect(initialState.contexualEntitiesOptions.size).toBe(0);
		expect(initialState.entitiesOptions.size).toBe(0);
		expect(initialState.selectedEntitiesOptions.size).toBe(0);
	});
});
