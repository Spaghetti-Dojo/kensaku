import EntitiesSearch from '@types';

import { Set } from '../../vo/set';

type Options<V> = EntitiesSearch.ControlOption<V>;

export function makeInitialState<E, K>(
	initialState: Partial<EntitiesSearch.EntitiesState<E, K>>
): EntitiesSearch.EntitiesState<E, K> {
	return {
		entities: Set.new<E>([]),
		kind: Set.new<K>([]),
		contextualEntitiesOptions: Set.new<Options<E>>(),
		currentEntitiesOptions: Set.new<Options<E>>(),
		selectedEntitiesOptions: Set.new<Options<E>>(),
		searchPhrase: '',
		...initialState,
	};
}
