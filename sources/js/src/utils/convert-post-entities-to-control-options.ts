import { Set } from 'immutable';

import { makeControlOption } from './make-control-option';

type Properties = Readonly<{
	title: { rendered: string; raw: string } | string;
	id: number;
}>;

export function convertPostEntitiesToControlOptions(
	postsEntities: Set<Properties>
) {
	return postsEntities.map((entity) => {
		let entityTitle = '';

		if (typeof entity.title === 'object') {
			entityTitle = entity.title?.rendered;
		}
		if (typeof entity.title === 'string') {
			entityTitle = entity.title;
		}

		return makeControlOption(entityTitle, entity.id);
	});
}
