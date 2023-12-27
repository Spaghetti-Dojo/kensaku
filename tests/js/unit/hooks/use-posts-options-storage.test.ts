import { describe, expect, it } from '@jest/globals';

import { renderHook } from '@testing-library/react-hooks';

import { usePostsOptionsStorage } from '../../../../sources/js/src/hooks/use-posts-options-storage';

describe('Use Posts Options Storage', () => {
	it('returns always the same state and dispatcher', () => {
		// @ts-ignore
		const { state, dispatch } = renderHook(() => usePostsOptionsStorage());
		// @ts-ignore
		const { state: state2, dispatch: dispatch2 } = renderHook(() =>
			usePostsOptionsStorage()
		);

		expect(state === state2).toEqual(true);
		expect(dispatch === dispatch2).toEqual(true);
	});
});
