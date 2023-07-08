import { EntitiesSearch } from '@entities-search-types';

import { Set } from 'immutable';

import { useEntityRecords as useCoreEntityRecords } from '@wordpress/core-data';

// TODO `useEntityRecords` needs tests
export function useEntityRecords<Entity>(
	kind: string,
	name: string,
	queryArgs: Record<string, unknown> = {}
): EntitiesSearch.EntitiesRecords<Entity> {
	const entities = useCoreEntityRecords<Entity>(kind, name, queryArgs);
	const status = entities.status as any as EntitiesSearch.ResolveStatus;

	return Object.freeze({
		records: () => Set(entities.records ?? []),
		isResolving: () =>
			entities.isResolving &&
			!entities.hasResolved &&
			status === EntitiesSearch.ResolveStatus.RESOLVING,
		errored: () => makeStatusCallback(entities, 'ERROR'),
		succeed: () => makeStatusCallback(entities, 'SUCCESS'),
	});
}

const makeStatusCallback = <Entity>(
	entities: ReturnType<typeof useCoreEntityRecords<Entity>>,
	status: string
) => entities?.hasResolved && entities?.status === status;
