import { EntitiesSearch } from '@entities-search-types';

import { useEntityRecords } from './use-entity-records';

// TODO `useQueryViewablePostTypes` require more unit tests
export function useQueryViewablePostTypes(): EntitiesSearch.EntitiesRecords<EntitiesSearch.ViewablePostType> {
	const entitiesRecords = useEntityRecords<EntitiesSearch.PostType<'edit'>>(
		'root',
		'postTypes'
	);

	const viewablePostTypes = entitiesRecords
		.records()
		.filter((postType) => postType.viewable);

	// TODO Need to convert PostType to ViewablePostType
	return {
		...entitiesRecords,
		// @ts-ignore
		records: () => viewablePostTypes,
	};
}
