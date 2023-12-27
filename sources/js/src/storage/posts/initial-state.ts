import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

type Options<V> = EntitiesSearch.ControlOption<V>;

export function makeInitialState<V>(): EntitiesSearch.PostsState<V> {
	return {
		contexualPostsOptions: OrderedSet<Options<V>>([]),
		postsOptions: OrderedSet<Options<V>>([]),
		selectedPostsOptions: OrderedSet<Options<V>>([]),
	};
}
