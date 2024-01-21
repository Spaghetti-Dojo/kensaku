import EntitiesSearch from '@types';

import { Set } from '../vo/set';
import { fetch } from './fetch';

export async function searchEntities<E>(
	type: string,
	subtype: Set<string>,
	phrase: string,
	queryArguments?: EntitiesSearch.QueryArguments<string>
): Promise<Set<E>> {
	const {
		exclude,
		include,
		fields = ['title', 'id'],
		...restArguments
	} = queryArguments ?? {};

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
		type,
		search: phrase,
		subtype: subtype.toArray(),
		_fields: serializeFields(fields),
	});

	// TODO What happen in the case of an error?
	const entities = await fetch<Array<E>>({
		path: `?rest_route=/wp/v2/search&${params.toString()}`,
	});

	return new Set(entities);
}

function serializeFields(fields: EntitiesSearch.SearchQueryFields): string {
	return fields.join(',');
}
