import { describe, expect, it, jest } from '@jest/globals';

import { renderHook } from '@testing-library/react';

import { useEntitiesOptionsStorage } from '../../../../sources/client/src/hooks/use-entities-options-storage';

jest.mock('react', () => ({
	// @ts-ignore
	...jest.requireActual('react'),
	useEffect: jest.fn(),
}));
describe('Use Posts Options Storage', () => {
	it('returns always the same state and dispatcher', () => {
		const entitiesSearch = jest.fn() as Parameters<
			typeof useEntitiesOptionsStorage
		>[1];

		// @ts-ignore
		const { state, dispatch } = renderHook(() =>
			useEntitiesOptionsStorage({}, entitiesSearch)
		);
		// @ts-ignore
		const { state: state2, dispatch: dispatch2 } = renderHook(() =>
			useEntitiesOptionsStorage({}, entitiesSearch)
		);

		expect(state === state2).toEqual(true);
		expect(dispatch === dispatch2).toEqual(true);
	});
});
