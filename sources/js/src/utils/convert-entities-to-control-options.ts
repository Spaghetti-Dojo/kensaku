import EntitiesSearch from '@types';
import { Set } from 'immutable';

type Entity = { name: string; slug: string };
type ControlOption = EntitiesSearch.ControlOption<Entity['slug']>;

export function convertEntitiesToControlOptions(
	entities: Set<Entity>
): Set<ControlOption> {
	return entities.map(convertEntityToControlOption);
}

// TODO The key to use from which retrieve the value must be passed specifically.
function convertEntityToControlOption(entity: Entity): ControlOption {
	return {
		label: entity.name,
		value: entity.slug,
	};
}
