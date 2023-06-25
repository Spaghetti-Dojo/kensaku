import { EntitiesSearch } from '@entities-search-types';

import { useEntityRecords as useCoreEntityRecords } from '@wordpress/core-data';

// TODO Return Immutable Entities Records
export function useEntityRecords<RecordType>(
	kind: string,
	name: string,
	queryArgs: Record<string, unknown> = {}
): EntitiesSearch.EntitiesRecords<RecordType> {
	const entitiesRecords = useCoreEntityRecords<RecordType>(
		kind,
		name,
		queryArgs
	);

	const makeStatusCallback = (
		entitiesRecords: ReturnType<typeof useCoreEntityRecords<RecordType>>,
		status: string
	) => entitiesRecords?.hasResolved && entitiesRecords?.status === status;

	return {
		records: entitiesRecords?.records ?? null,
		isResolving: () =>
			(entitiesRecords?.isResolving && !entitiesRecords?.hasResolved) ??
			false,
		isIdle: () =>
			entitiesRecords?.isResolving && entitiesRecords?.status === 'IDLE',
		errored: () => makeStatusCallback(entitiesRecords, 'ERROR'),
		succeed: () => makeStatusCallback(entitiesRecords, 'SUCCESS'),
	};
}
