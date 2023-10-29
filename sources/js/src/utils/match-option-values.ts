import EntitiesSearch from '@types';
import { Set } from 'immutable';

export const matchOptionValues = <V>(
	value: Set<V> | null,
	options: Set<EntitiesSearch.ControlOption<V>>
): Set<EntitiesSearch.ControlOption<V>> | null => {
	if (!value) return null;
	return options.filter((option) => value?.has(option.value));
};
