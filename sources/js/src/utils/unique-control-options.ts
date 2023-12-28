import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

export function uniqueControlOptions<V>(
	set: OrderedSet<EntitiesSearch.ControlOption<V>>
): OrderedSet<EntitiesSearch.ControlOption<V>> {
	const uniqueOptions = OrderedSet<EntitiesSearch.ControlOption<V>>(
		[]
	).asMutable();

	const temp: Array<EntitiesSearch.ControlOption<V>['value']> = [];

	for (const option of set) {
		!temp.includes(option.value) && uniqueOptions.add(option);
		temp.push(option.value);
	}

	return uniqueOptions.asImmutable();
}
