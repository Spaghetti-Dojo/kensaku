import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { makeControlOption } from './make-control-option';

export function convertPostEntitiesToControlOptions(
	postsEntities: OrderedSet<EntitiesSearch.Post>
): OrderedSet<EntitiesSearch.ControlOption<number>> {
	const mutableOptions = postsEntities.map((entity) =>
		makeControlOption(entity.title.rendered, entity.id)
	);

	return OrderedSet(mutableOptions);
}
