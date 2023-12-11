import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { makeControlOption } from './make-control-option';

type Entity = EntitiesSearch.PostType;
type ControlOption = EntitiesSearch.ControlOption<Entity['slug']>;

export function convertPostTypeEntitiesToControlOptions(
	entities: OrderedSet<Entity>
): OrderedSet<ControlOption> {
	const mutableOptions = entities.map((entity) =>
		makeControlOption(entity.name, entity.slug)
	);

	return OrderedSet(mutableOptions);
}
