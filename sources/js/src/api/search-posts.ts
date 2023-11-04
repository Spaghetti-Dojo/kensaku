import EntitiesSearch from '@types';

import { fetch } from './fetch';

type Properties = Readonly<{
	title: { rendered: string; raw: string } | string;
	id: number;
}>;

// TODO Parametrize the fields
export async function searchPosts<E>(
	type: string,
	phrase: string
): Promise<Array<E>> {
	const params = new URLSearchParams({
		_fields: 'title,id',
		search: phrase,
		subtype: type,
		posts_per_page: '10',
	});

	// TODO What happen in the case of an error?
	return fetch({
		path: `?rest_route=/wp/v2/search&${params.toString()}`,
	});
}

// TODO For now it would be a string but it should be a generic
export function buildSelectOption(
	entity: Properties
): EntitiesSearch.ControlOption<number> {
	let entityTitle = '';

	if (typeof entity.title === 'object') {
		entityTitle = entity.title?.rendered;
	}
	if (typeof entity.title === 'string') {
		entityTitle = entity.title;
	}

	return {
		label: entityTitle ?? '',
		value: entity.id ?? 0,
	};
}
