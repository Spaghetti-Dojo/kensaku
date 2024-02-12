import EntitiesSearch from '@types';

import { Set } from '../../vo/set';

type Options<V> = EntitiesSearch.ControlOption<V>;

export function makeInitialState<E, K>(
	initialState: Partial<EntitiesSearch.EntitiesState<E, K>>
): EntitiesSearch.EntitiesState<E, K> {
	return {
		entities: new Set<E>([]),
		kind: new Set<K>([]),
		contextualEntitiesOptions: new Set<Options<E>>(),
		currentEntitiesOptions: new Set<Options<E>>(),
		selectedEntitiesOptions: new Set<Options<E>>(),
		searchPhrase: '',
		...initialState,
	};
}
