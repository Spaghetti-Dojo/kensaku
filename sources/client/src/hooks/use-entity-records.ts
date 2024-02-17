/**
 * External dependencies
 */
import EntitiesSearch from '@types';

/**
 * WordPress dependencies
 */
import { useEntityRecords as useCoreEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { Set } from '../vo/set';

enum ResolveStatus {
	ERROR = 'ERROR',
	SUCCESS = 'SUCCESS',
	RESOLVING = 'RESOLVING',
}

/**
 * The hook will return an empty collection while resolving.
 * This is to guarantee a better flow in the data manipulation, therefore do not count on the data returned by the
 * `records()` as an indicator of the hook status.
 *
 * @public
 * @param kind      The kind of entity to fetch. E.g. 'root', 'postType', 'taxonomy', etc.
 * @param name      The name of the entity to fetch. E.g. 'post', 'page', 'category', etc.
 * @param queryArgs The query args to pass to the entity fetch. E.g. { per_page: 100 }
 */
export function useEntityRecords< Entity >(
	kind: string,
	name: string,
	queryArgs: Record< string, unknown > = {}
): EntitiesSearch.EntitiesRecords< Entity > {
	const entities = useCoreEntityRecords< Entity >( kind, name, queryArgs );
	const status = entities.status as any as ResolveStatus;

	return Object.freeze( {
		records: () => new Set( entities.records ?? [] ),
		isResolving: () =>
			entities.isResolving &&
			! entities.hasResolved &&
			status === ResolveStatus.RESOLVING,
		errored: () => makeStatusCallback( entities, ResolveStatus.ERROR ),
		succeed: () => makeStatusCallback( entities, ResolveStatus.SUCCESS ),
	} );
}

function makeStatusCallback< Entity >(
	entities: ReturnType< typeof useCoreEntityRecords< Entity > >,
	status: string
): boolean {
	return entities?.hasResolved && entities?.status === status;
}
