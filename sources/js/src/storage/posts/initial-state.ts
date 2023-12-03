import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

type Options<V> = EntitiesSearch.ControlOption<V>;

export function makeInitialState<V>(): EntitiesSearch.PostsState<V> {
	return {
		initialPostsOptions: OrderedSet<Options<V>>([]),
		postsOptions: OrderedSet<Options<V>>([]),
		cachedPostsOptions: OrderedSet<Options<V>>([]),
		selectedPostsOptions: OrderedSet<Options<V>>([]),
	};
}
