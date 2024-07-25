/**
 * External dependencies
 */
import Kensaku from '@types';
import React from 'react';

/**
 * WordPress dependencies
 */
import { useThrottle } from '@wordpress/compose';
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { Set } from '../models/set';

type SearchPhrase = Parameters< Kensaku.SearchControl[ 'onChange' ] >[ 0 ];
type SearchFunc = ( phrase: SearchPhrase ) => void;

/**
 * Build a function to search the entities by a phrase
 *
 * @public
 * @param searchEntities The function that will search the entities
 * @param kind           The kind of entities to search
 * @param entities       The entities to exclude from the search
 * @param dispatch       The dispatch function to update the state
 */
export function useSearch< E, K >(
	searchEntities: Kensaku.SearchEntitiesFunction< E, K >,
	kind: Kensaku.Kind< K >,
	entities: Kensaku.Entities< E >,
	dispatch: React.Dispatch< Kensaku.StoreAction< E, K > >
): SearchFunc {
	return useThrottle(
		( phrase: SearchPhrase ) => {
			const _phrase = extractPhrase( phrase );

			searchEntities( _phrase, kind, {
				exclude: entities,
			} )
				.then( ( result ) =>
					dispatch( {
						type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
						currentEntitiesOptions: result,
					} )
				)
				.catch( ( error ) => {
					doAction( 'kensaku.on-search.error', error );
					const emptySet = new Set< Kensaku.ControlOption< E > >();
					dispatch( {
						type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
						currentEntitiesOptions: emptySet,
					} );
					return emptySet;
				} )
				.finally( () =>
					dispatch( {
						type: 'UPDATE_SEARCH_PHRASE',
						searchPhrase: _phrase,
					} )
				);
		},
		300,
		{ leading: false, trailing: true }
	);
}

function extractPhrase( phraseOrEvent: SearchPhrase ): string {
	const phrase =
		typeof phraseOrEvent === 'string'
			? phraseOrEvent
			: phraseOrEvent.target.value;

	return phrase.trim();
}
