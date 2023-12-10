import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

export function orderSelectedOptionsAtTheTop<V>(
	options: OrderedSet<EntitiesSearch.ControlOption<V>>,
	collection: OrderedSet<V> | undefined
): OrderedSet<EntitiesSearch.ControlOption<V>> {
	if (options.size <= 0) {
		return options;
	}
	if (collection === undefined || collection.size <= 0) {
		return options;
	}

	const _collection =
		OrderedSet<EntitiesSearch.ControlOption<V>>().asMutable();
	const _options = OrderedSet<EntitiesSearch.ControlOption<V>>().asMutable();

	options.forEach((option) => {
		collection.includes(option.value)
			? _collection.add(option)
			: _options.add(option);
	});

	return _collection.concat(_options).asImmutable();
}
