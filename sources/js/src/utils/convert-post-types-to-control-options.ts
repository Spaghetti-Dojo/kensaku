import EntitiesSearch from '@types';
import { Set } from 'immutable';

export function convertPostTypesToControlOptions(
	postTypes: Set<EntitiesSearch.PostType>
): Set<EntitiesSearch.ControlOption<string>> {
	return postTypes.map((postType) => ({
		label: postType.name,
		value: postType.slug,
	}));
}
