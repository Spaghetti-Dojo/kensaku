import { EntitiesSearch } from '@entities-search-types';

import { Set } from 'immutable';

import { useSelect } from '@wordpress/data';

type Selectors = {
	getPostTypes(): EntitiesSearch.PostType[] | null;
};

export function useQueryViewablePostTypes(): Set<EntitiesSearch.ViewablePostType> | null {
	const coreSelectors = useSelect(
		(select: (store: string) => Selectors) => select('core'),
		[]
	);
	const postTypes = coreSelectors.getPostTypes();

	if (postTypes === null) {
		return null;
	}

	const viewablePostTypes: EntitiesSearch.ViewablePostType[] =
		postTypes.filter((postType) => postType.viewable);

	return Set(viewablePostTypes);
}
