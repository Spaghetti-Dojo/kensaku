import EntitiesSearch from '@types';
import { Reducer, Dispatch } from 'react';

import { useReducer } from '@wordpress/element';

import { makeInitialState } from '../storage/posts/initial-state';
import { reducer } from '../storage/posts/reducer';

type _Reducer<V> = Reducer<
	EntitiesSearch.PostsState<V>,
	EntitiesSearch.PostsAction<V>
>;

export function usePostsStorage<V>(): Readonly<{
	state: EntitiesSearch.PostsState<V>;
	dispatch: Dispatch<EntitiesSearch.PostsAction<V>>;
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
