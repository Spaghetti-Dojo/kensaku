import EntitiesSearch from '@types';

export function reducer<P>(
	state: EntitiesSearch.PostsState<P>,
	action: EntitiesSearch.PostsAction<P>
): EntitiesSearch.PostsState<P> {
	switch (action.type) {
		case 'UPDATE_CONTEXUAL_POSTS_OPTIONS':
			return {
				...state,
				contexualPostsOptions: action.contextualPostsOptions,
			};

		case 'UPDATE_POSTS_OPTIONS':
			return {
				...state,
				postsOptions: action.postsOptions,
			};

		case 'UPDATE_SELECTED_POSTS_OPTIONS':
			return {
				...state,
				selectedPostsOptions: action.selectedPostsOptions,
			};

		default:
			return state;
	}
}
