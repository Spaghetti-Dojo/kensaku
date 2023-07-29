import { Set } from 'immutable';

import EntitiesSearch from '../@types';

export function convertPostTypesToControlOptions(
	postTypes: Set<EntitiesSearch.PostType>
): Set<EntitiesSearch.ControlOption<string>> {
	return postTypes.map((postType) => ({
		label: postType.name,
		value: postType.slug,
	}));
}
