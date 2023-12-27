import { describe, expect, it } from '@jest/globals';

import { makeInitialState } from '../../../../sources/js/src/storage/posts/initial-state';

describe('Initial state', () => {
	it('ensure all options are empty', () => {
		const initialState = makeInitialState();
		expect(initialState.contexualPostsOptions.size).toBe(0);
		expect(initialState.postsOptions.size).toBe(0);
		expect(initialState.selectedPostsOptions.size).toBe(0);
	});
});
