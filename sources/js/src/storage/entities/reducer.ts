import EntitiesSearch from '@types';

export function reducer<P>(
	state: EntitiesSearch.EntitiesState<P>,
	action: EntitiesSearch.EntitiesAction<P>
): EntitiesSearch.EntitiesState<P> {
	switch (action.type) {
		case 'UPDATE_CONTEXUAL_ENTITIES_OPTIONS':
			return {
				...state,
				contexualEntitiesOptions: action.contextualEntitiesOptions,
			};

		case 'UPDATE_ENTITIES_OPTIONS':
			return {
				...state,
				entitiesOptions: action.entitiesOptions,
			};

		case 'UPDATE_SELECTED_ENTITIES_OPTIONS':
			return {
				...state,
				selectedEntitiesOptions: action.selectedEntitiesOptions,
			};

		default:
			return state;
	}
}
