import EntitiesSearch from '@types';

import { Set } from '../vo/set';

export function orderSelectedOptionsAtTheTop<V>(
	options: Set<EntitiesSearch.ControlOption<V>>,
	collection: Set<V> | undefined
): Set<EntitiesSearch.ControlOption<V>> {
	if (options.length() <= 0) {
		return options;
	}
	if (collection === undefined || collection.length() <= 0) {
		return options;
	}

	let _collection = new Set<EntitiesSearch.ControlOption<V>>();
	let _options = new Set<EntitiesSearch.ControlOption<V>>();

	options.forEach((option) => {
		if (collection.has(option.value)) {
			_collection = _collection.add(option);
		} else {
			_options = _options.add(option);
		}
	});

	return _collection.concat(_options);
}
