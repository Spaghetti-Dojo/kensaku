import EntitiesSearch from '@types';

export function makeControlOption<V>(
	label: string,
	value: V
): EntitiesSearch.ControlOption<V> {
	return Object.freeze({ label, value });
}
