import EntitiesSearch from '@types';
import { Reducer, Dispatch, useReducer } from 'react';

import { makeInitialState } from '../storage/entities/initial-state';
import { reducer } from '../storage/entities/reducer';

type _Reducer<V> = Reducer<
	EntitiesSearch.EntitiesState<V>,
	EntitiesSearch.EntitiesAction<V>
>;

export function useEntitiesOptionsStorage<V>(): Readonly<{
	state: EntitiesSearch.EntitiesState<V>;
	dispatch: Dispatch<EntitiesSearch.EntitiesAction<V>>;
}> {
	const [state, dispatch] = useReducer<_Reducer<V>>(
		reducer,
		makeInitialState<V>()
	);

	return {
		state,
		dispatch,
	};
}
