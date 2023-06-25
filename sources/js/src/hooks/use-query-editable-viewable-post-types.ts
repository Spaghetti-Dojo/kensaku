import { EntitiesSearch } from '@entities-search-types';

import { useEntityRecords } from './use-entity-records';

// TODO Return an Immutable collection (use Immutable JS)
export function useQueryEditableViewablePostTypes(): EntitiesSearch.EntitiesRecords<EntitiesSearch.EditableViewablePostType> {
	const entities = useEntityRecords<EntitiesSearch.EditablePostType>(
		'root',
		'postType'
	);

	const viewablePostTypes = entities.records?.filter(
		(postType) => postType.viewable
	);

	return {
		...entities,
		records: viewablePostTypes,
	};
}
