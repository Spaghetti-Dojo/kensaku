import { EntitiesSearch } from '@entities-search-types';

import { useSelect } from '@wordpress/data';

type Selectors = {
	getPostTypes(): EntitiesSearch.EditablePostType[] | null;
};

// TODO Return an Immutable collection (use Immutable JS)
export function useQueryViewablePostTypes() {
	const coreSelectors = useSelect(
		(select: (store: string) => Selectors) => select('core'),
		[]
	);
	// TODO Is it possible to `useEntityRecords`? So that we can send back resolving information?
	const postTypes = coreSelectors.getPostTypes();

	if (postTypes === null) {
		return null;
	}

	return postTypes.filter(
		(postType) => postType.viewable
	) as EntitiesSearch.EditableViewablePostType[];
}
