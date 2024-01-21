import EntitiesSearch from '@types';

export function makeControlOption<V>(
	label: string,
	value: V
): EntitiesSearch.ControlOption<V> {
	// TODO Need deep freeze.
	return Object.freeze({ label, value });
}
