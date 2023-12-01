import { OrderedSet, Set } from 'immutable';

import { fetch } from './fetch';

// TODO Parametrize the fields
// TODO Write the underline search function.
export async function searchPosts<E>(
	type: string,
	phrase: string,
	queryArguments: {
		exclude: Set<string>;
		include: Set<string>;
		[p: string]: unknown;
	}
): Promise<OrderedSet<E>> {
	const { exclude, include, ...restArguments } = queryArguments;

	// @ts-ignore we need to pass string[] to the URLSearchParams
	const params = new URLSearchParams({
		per_page: '10',
		order: 'DESC',
		orderBy: 'title',
		...{
			exclude: exclude?.toArray() ?? [],
			include: include?.toArray() ?? [],
			...restArguments,
		},
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
