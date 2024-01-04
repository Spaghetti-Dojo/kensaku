import EntitiesSearch from '@types';
import { OrderedSet, Set } from 'immutable';

import { fetch } from './fetch';

// TODO Parametrize the fields.
// TODO Write the underline search function.
// TODO Make the `queryArguments` optional.
export async function searchEntities<E>(
	kindName: string,
	entityName: string,
	phrase: string,
	queryArguments: {
		exclude: Set<string>;
		include: Set<string>;
		fields?: EntitiesSearch.SearchQueryFields;
		[p: string]: unknown;
	}
): Promise<OrderedSet<E>> {
	const {
		exclude,
		include,
		fields = ['title', 'id'],
		...restArguments
	} = queryArguments;

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
		type: kindName,
		search: phrase,
		subtype: entityName,
		_fields: serializeFields(fields),
	});

	// TODO What happen in the case of an error?
	const entities = await fetch<Array<E>>({
		path: `?rest_route=/wp/v2/search&${params.toString()}`,
	});

	return OrderedSet(entities);
}

function serializeFields(fields: EntitiesSearch.SearchQueryFields): string {
	return fields.join(',');
}
