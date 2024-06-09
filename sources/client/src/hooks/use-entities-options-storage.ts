/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import { Reducer, Dispatch, useReducer, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { makeInitialState } from '../storage/entities/initial-state';
import { reducer } from '../storage/entities/reducer';
import { Set } from '../models/set';

type _Reducer< E, K > = Reducer<
	EntitiesSearch.EntitiesState< E, K >,
	EntitiesSearch.StoreAction< E, K >
>;

/**
 * @public
 * @param initialState   The initial state configuration
 * @param searchEntities The function that will search the entities
 */
export function useEntitiesOptionsStorage< E, K >(
	initialState: Pick<
		EntitiesSearch.EntitiesState< E, K >,
		'entities' | 'kind'
	>,
	searchEntities: EntitiesSearch.SearchEntitiesFunction< E, K >
): Readonly<
	[
		EntitiesSearch.EntitiesState< E, K >,
		Dispatch< EntitiesSearch.StoreAction< E, K > >,
	]
> {
	const [ state, dispatch ] = useReducer< _Reducer< E, K > >(
		reducer,
		makeInitialState< E, K >( initialState )
	);

	useEffect( () => {
		Promise.all( [
			searchEntities( '', state.kind, {
				exclude: state.entities,
			} ),
			state.entities.length() > 0
				? searchEntities( '', state.kind, {
						include: state.entities,
						per_page: '-1',
				  } )
				: undefined,
		] )
			.then( ( result ) => {
				const currentEntitiesOptions = result[ 0 ] ?? new Set();
				const selectedEntitiesOptions = result[ 1 ] ?? new Set();

				dispatch( {
					type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
					selectedEntitiesOptions,
				} );
				dispatch( {
					type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
					currentEntitiesOptions,
				} );
			} )
			.catch( ( error ) => {
				doAction(
					'wp-entities-search.on-storage-initialization.error',
					error
				);
			} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return [ state, dispatch ] as const;
}
