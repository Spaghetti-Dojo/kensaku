import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { makeControlOption } from './make-control-option';

type Entity = {
	name: string;
	slug: string;
};
type ControlOption = EntitiesSearch.ControlOption<Entity['slug']>;

// TODO Not used, can be removed and also it's invalid.
export function convertEntitiesToControlOptions(
	entities: OrderedSet<Entity>
): OrderedSet<ControlOption> {
	const mutableOptions = entities.map((entity) =>
		makeControlOption(entity.name, entity.slug)
	);

	return OrderedSet(mutableOptions);
}
