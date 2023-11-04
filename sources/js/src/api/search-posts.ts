import EntitiesSearch from '@types';

import { fetch } from './fetch';

type Properties = Readonly<{
	title: { rendered: string; raw: string } | string;
	slug: string;
}>;

export async function searchPosts(
	type: string,
	phrase: string
): Promise<Array<Properties>> {
	// @ts-ignore
	const params = new URLSearchParams({
		_fields: 'title,slug',
		s: phrase,
	});

	return fetch({
		path: `?rest_route=/wp/v2/${type}&${params.toString()}`,
	});
}

export function buildSelectOption(
	entity: Properties
): EntitiesSearch.ControlOption<Properties['slug']> {
	let entityTitle = '';

	if (typeof entity.title === 'object') {
		entityTitle = entity.title?.rendered;
	}
	if (typeof entity.title === 'string') {
		entityTitle = entity.title;
	}

	return {
		label: entityTitle ?? '',
		value: entity.slug ?? '',
	};
}
