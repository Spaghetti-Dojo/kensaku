import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { makeControlOption } from './make-control-option';

type Entity = { name: string; slug: string };
type ControlOption = EntitiesSearch.ControlOption<Entity['slug']>;

export function convertPostTypeEntitiesToControlOptions(
	entities: OrderedSet<Entity>
): OrderedSet<ControlOption> {
	return entities.map((entity) =>
		makeControlOption(entity.name, entity.slug)
	);
}
