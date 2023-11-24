import { Set } from 'immutable';

import { fetch } from './fetch';

// TODO Parametrize the fields
export async function searchPosts<E>(
	type: string,
	phrase: string
): Promise<Set<E>> {
	const params = new URLSearchParams({
		_fields: 'title,id',
		search: phrase,
		subtype: type,
		posts_per_page: '10',
	});

	// TODO What happen in the case of an error?
	const entities = await fetch<Array<E>>({
		path: `?rest_route=/wp/v2/search&${params.toString()}`,
	});

	return Set(entities);
}
