import EntitiesSearch from '@types';
import { Set } from 'immutable';

export function convertPostTypesToControlOptions(
	postTypes: Set<EntitiesSearch.PostType>
): Set<EntitiesSearch.ControlOption<EntitiesSearch.PostType['slug']>> {
	return postTypes.map((postType) => ({
		label: postType.name,
		value: postType.slug,
	}));
}
