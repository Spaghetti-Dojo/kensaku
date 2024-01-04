import { describe, expect, it } from '@jest/globals';

import { renderHook } from '@testing-library/react-hooks';

import { useEntitiesOptionsStorage } from '../../../../sources/js/src/hooks/use-entities-options-storage';

describe('Use Posts Options Storage', () => {
	it('returns always the same state and dispatcher', () => {
		// @ts-ignore
		const { state, dispatch } = renderHook(() =>
			useEntitiesOptionsStorage()
		);
		// @ts-ignore
		const { state: state2, dispatch: dispatch2 } = renderHook(() =>
			useEntitiesOptionsStorage()
		);

		expect(state === state2).toEqual(true);
		expect(dispatch === dispatch2).toEqual(true);
	});
});
