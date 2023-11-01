import EntitiesSearch from '@types';

import { useEntityRecords } from './use-entity-records';

/**
 * @public
 *
 * @param postType
 * @param keywords
 */
export function useQueryPostsByPostTypes(
	postType: EntitiesSearch.PostType<'view'>,
	keywords: string
): EntitiesSearch.EntitiesRecords<EntitiesSearch.Post<'view'>> {
	return useEntityRecords<EntitiesSearch.Post>('postType', postType.slug, {
		per_page: 10,
		search: keywords,
	});
}
