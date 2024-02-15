import EntitiesSearch from '@types';
import React from 'react';

import { useThrottle } from '@wordpress/compose';
import { doAction } from '@wordpress/hooks';

import { Set } from '../vo/set';

type SearchPhrase = Parameters<EntitiesSearch.SearchControl['onChange']>[0];
type SearchFunc = (phrase: SearchPhrase) => void;

/**
 * Build a function to search the entities by a phrase
 *
 * @public
 * @param setSearchPhrase A function to set the search phrase
 * @param searchEntities  The function that will search the entities
 * @param kind            The kind of entities to search
 * @param entities        The entities to exclude from the search
 * @param dispatch        The dispatch function to update the state
 */
export function useSearch<E, K>(
	searchEntities: EntitiesSearch.SearchEntitiesFunction<E, K>,
	kind: EntitiesSearch.Kind<K>,
	entities: EntitiesSearch.Entities<E>,
	dispatch: React.Dispatch<EntitiesSearch.StoreAction<E, K>>
): SearchFunc {
	return useThrottle(
		(phrase: SearchPhrase) => {
			const _phrase = extractPhrase(phrase);

			searchEntities(_phrase, kind, {
				exclude: entities,
			})
				.then((result) =>
					dispatch({
						type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
						currentEntitiesOptions: result,
					})
				)
				.catch((error) => {
					doAction('wp-entities-search.on-search.error', error);
					const emptySet = new Set<EntitiesSearch.ControlOption<E>>();
					dispatch({
						type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
						currentEntitiesOptions: emptySet,
					});
					return emptySet;
				})
				.finally(() =>
					dispatch({
						type: 'UPDATE_SEARCH_PHRASE',
						searchPhrase: _phrase,
					})
				);
		},
		300,
		{ leading: false, trailing: true }
	);
}

function extractPhrase(phraseOrEvent: SearchPhrase): string {
	const phrase =
		typeof phraseOrEvent === 'string'
			? phraseOrEvent
			: phraseOrEvent.target.value;

	return phrase.trim();
}
