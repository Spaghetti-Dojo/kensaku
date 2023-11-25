import { OrderedSet } from 'immutable';

import { fetch } from './fetch';

// TODO Parametrize the fields
// TODO Write the underline search function.
export async function searchPosts<E>(
	type: string,
	phrase: string,
	queryArguments: Record<string, unknown>
): Promise<OrderedSet<E>> {
	const params = new URLSearchParams({
		per_page: '10',
		order: 'DESC',
		orderBy: 'title',
		...queryArguments,
		search: phrase,
		subtype: type,
		_fields: 'title,id',
	});

	// TODO What happen in the case of an error?
	const entities = await fetch<Array<E>>({
		path: `?rest_route=/wp/v2/search&${params.toString()}`,
	});

	return OrderedSet(entities);
}
