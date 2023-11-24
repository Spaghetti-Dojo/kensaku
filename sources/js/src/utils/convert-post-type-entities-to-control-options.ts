import EntitiesSearch from '@types';
import { Set } from 'immutable';

import { makeControlOption } from './make-control-option';

type Entity = { name: string; slug: string };
type ControlOption = EntitiesSearch.ControlOption<Entity['slug']>;

export function convertPostTypeEntitiesToControlOptions(
	entities: Set<Entity>
): Set<ControlOption> {
	return entities.map((entity) =>
		makeControlOption(entity.name, entity.slug)
	);
}
