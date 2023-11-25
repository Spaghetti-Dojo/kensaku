import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { useEntityRecords } from './use-entity-records';

/**
 * Hook to obtain the `viewable` post types only.
 * This is an api on top of `useEntityRecords` to facilitate the usage of the `viewable` post types.
 *
 * @public
 */
export function useQueryViewablePostTypes(): EntitiesSearch.EntitiesRecords<EntitiesSearch.ViewablePostType> {
	const entitiesRecords = useEntityRecords<EntitiesSearch.PostType<'edit'>>(
		'root',
		'postType',
		{ per_page: -1 }
	);

	const viewablePostTypes = entitiesRecords
		.records()
		.filter(
			(postType) => postType.viewable
		) as OrderedSet<EntitiesSearch.ViewablePostType>;

	return {
		...entitiesRecords,
		records: () => OrderedSet(viewablePostTypes),
	};
}
