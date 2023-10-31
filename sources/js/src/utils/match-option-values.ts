import EntitiesSearch from '@types';
import { Set } from 'immutable';

export function matchOptionValues<V>(
	collection: Set<V> | null,
	options: Set<EntitiesSearch.ControlOption<V>>
): Set<EntitiesSearch.ControlOption<V>> | null {
	if (!collection) return null;
	return options.filter((option) => collection?.has(option.value));
}
