import EntitiesSearch from '@types';

export function makeControlOption<V>(
	label: string,
	value: V
): EntitiesSearch.ControlOption<V> {
	return new (class {
		readonly label = label;
		readonly value = value;
	})();
}
