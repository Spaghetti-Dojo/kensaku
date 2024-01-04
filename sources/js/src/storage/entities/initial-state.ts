import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

type Options<V> = EntitiesSearch.ControlOption<V>;

export function makeInitialState<V>(): EntitiesSearch.EntitiesState<V> {
	return {
		contexualEntitiesOptions: OrderedSet<Options<V>>([]),
		entitiesOptions: OrderedSet<Options<V>>([]),
		selectedEntitiesOptions: OrderedSet<Options<V>>([]),
	};
}
