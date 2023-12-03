import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { isControlOption } from '../../utils/is-control-option';
import { uniqueOrderedSet } from '../../utils/unique-ordered-set';

function mergeCachedPostsOptions<V>(
	cachedPostsOptions: OrderedSet<EntitiesSearch.ControlOption<V>>,
	...orderedSets: OrderedSet<EntitiesSearch.ControlOption<V>>[]
): OrderedSet<EntitiesSearch.ControlOption<V>> {
	const merged = OrderedSet([]).asMutable();

	for (const orderedSet of orderedSets) {
		merged.merge(orderedSet);
	}

	return uniqueOrderedSet(cachedPostsOptions.merge(merged));
}

export function reducer<P>(
	state: EntitiesSearch.PostsState<P>,
	action: EntitiesSearch.PostsAction<P>
): EntitiesSearch.PostsState<P> {
	switch (action.type) {
		case 'SET_INITIAL_POSTS_OPTIONS':
			if (state.initialPostsOptions.size > 0) {
				return state;
			}

			return {
				...state,
				initialPostsOptions: action.postsOptions,
				cachedPostsOptions: mergeCachedPostsOptions(
					state.cachedPostsOptions,
					action.postsOptions
				),
			};

		case 'UPDATE_POSTS_OPTIONS':
			return {
				...state,
				postsOptions: action.postsOptions,
				cachedPostsOptions: mergeCachedPostsOptions(
					state.cachedPostsOptions,
					action.postsOptions
				),
			};

		case 'UPDATE_SELECTED_POSTS_OPTIONS':
			if (action.posts === undefined) {
				return { ...state, selectedPostsOptions: OrderedSet([]) };
			}

			if (isControlOption(action.posts.first())) {
				const selectedPostsOptions =
					action.posts as EntitiesSearch.PostsState<P>['selectedPostsOptions'];
				return {
					...state,
					selectedPostsOptions,
					cachedPostsOptions: mergeCachedPostsOptions(
						state.cachedPostsOptions,
						selectedPostsOptions
					),
				};
			}

			const posts = action.posts as OrderedSet<P>;
			return {
				...state,
				selectedPostsOptions: state.cachedPostsOptions.filter(
					(option) => posts.has(option.value)
				),
			};

		default:
			return state;
	}
}
