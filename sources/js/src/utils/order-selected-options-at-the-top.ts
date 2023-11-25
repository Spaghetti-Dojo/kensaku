import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

export function orderSelectedOptionsAtTheTop<V>(
	options: OrderedSet<EntitiesSearch.ControlOption<V>>,
	collection: OrderedSet<V> | undefined
): OrderedSet<EntitiesSearch.ControlOption<V>> {
	if (collection === undefined || collection.size <= 0) {
		return options;
	}

	const selectedOptions =
		OrderedSet<EntitiesSearch.ControlOption<V>>().asMutable();
	const _options = OrderedSet<EntitiesSearch.ControlOption<V>>().asMutable();

	options.forEach((option) => {
		collection.includes(option.value)
			? selectedOptions.add(option)
			: _options.add(option);
	});

	return selectedOptions.concat(_options).asImmutable();
}
