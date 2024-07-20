/**
 * External dependencies
 */
import Kensaku from '@types';

/**
 * Internal dependencies
 */
import { Set } from '../../models/set';

type Options< V > = Kensaku.ControlOption< V >;

/**
 * @internal
 * @param initialState The initial state to merge with the default state
 */
export function makeInitialState< E, K >(
	initialState: Partial< Kensaku.EntitiesState< E, K > >
): Kensaku.EntitiesState< E, K > {
	return {
		entities: new Set< E >( [] ),
		kind: new Set< K >( [] ),
		currentEntitiesOptions: new Set< Options< E > >(),
		selectedEntitiesOptions: new Set< Options< E > >(),
		searchPhrase: '',
		...initialState,
	};
}
