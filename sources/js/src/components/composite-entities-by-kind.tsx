import type EntitiesSearch from '@types';
import { OrderedSet, Set } from 'immutable';
import React, { JSX, useState, useEffect } from 'react';

import { useEntitiesOptionsStorage } from '../hooks/use-entities-options-storage';
import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';
import { uniqueControlOptions } from '../utils/unique-control-options';

type SearchPhrase = Parameters<EntitiesSearch.SearchControl['onChange']>[0];
type Kind<V> = EntitiesSearch.KindControl<V>['value'];
type Entities<V> = EntitiesSearch.EntitiesControl<V>['value'];
type SearchEntities<P, T> = EntitiesSearch.CompositeEntitiesKinds<
	P,
	T
>['searchEntities'];

export function CompositeEntitiesByKind<P, T>(
	props: EntitiesSearch.CompositeEntitiesKinds<P, T>
): JSX.Element {
	const { state, dispatch } = useEntitiesOptionsStorage<P>();
	const [searchPhrase, setSearchPhrase] = useState('');
	const [entitiesAndKind, setEntitiesAndKind] = useState({
		entities: props.entities.value ?? OrderedSet([]),
		kind: props.kind.value,
	});

	useEffect(() => {
		let promises = Set<ReturnType<SearchEntities<P, T>>>().asMutable();

		promises.add(
			props.searchEntities('', entitiesAndKind.kind, {
				exclude: entitiesAndKind.entities,
			})
		);

		if (entitiesAndKind.entities.size > 0) {
			promises.add(
				props.searchEntities('', entitiesAndKind.kind, {
					include: entitiesAndKind.entities,
					per_page: '-1',
				})
			);
		}

		Promise.all(promises)
			.then((result) => {
				const entitiesOptions = result[0] ?? OrderedSet([]);
				const selectedEntitiesOptions = result[1] ?? OrderedSet([]);

				dispatch({
					type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
					selectedEntitiesOptions,
				});
				dispatch({
					type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS',
					contextualEntitiesOptions: entitiesOptions,
				});
				dispatch({
					type: 'UPDATE_ENTITIES_OPTIONS',
					entitiesOptions,
				});
			})
			.catch((error) => {
				console.warn(`Composite Entities by Kind: ${error}`);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const searchEntitiesByKind = async (phrase: string, kind: Kind<T>) => {
		if (!phrase) {
			return;
		}

		props
			.searchEntities(phrase, kind, {
				exclude: entitiesAndKind.entities,
			})
			.then((result) =>
				dispatch({
					type: 'UPDATE_ENTITIES_OPTIONS',
					entitiesOptions: result,
				})
			)
			.catch(() => {
				// TODO Add warning for user feedback.
				const emptySet = OrderedSet([]);
				dispatch({
					type: 'UPDATE_ENTITIES_OPTIONS',
					entitiesOptions: emptySet,
				});
				return emptySet;
			});
	};

	const onChangeEntities = (entities: Entities<P>) => {
		// TODO It is the state still necessary having the reducer?
		setEntitiesAndKind({
			...entitiesAndKind,
			entities: entities ?? OrderedSet([]),
		});
		props.entities.onChange(entities);

		if ((entities?.size ?? 0) <= 0) {
			dispatch({
				type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
				selectedEntitiesOptions: OrderedSet([]),
			});
			dispatch({
				type: 'UPDATE_ENTITIES_OPTIONS',
				entitiesOptions: state.contexualEntitiesOptions,
			});
			return;
		}

		let promises = Set<ReturnType<SearchEntities<P, T>>>([
			props.searchEntities(searchPhrase, entitiesAndKind.kind, {
				exclude: entities,
			}),
			props.searchEntities('', entitiesAndKind.kind, {
				include: entities,
				per_page: '-1',
			}),
		]);

		Promise.all(promises)
			.then((result) => {
				const entitiesOptions = result[0] ?? OrderedSet([]);
				const selectedEntitiesOptions = result[1] ?? OrderedSet([]);

				dispatch({
					type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
					selectedEntitiesOptions,
				});
				dispatch({
					type: 'UPDATE_ENTITIES_OPTIONS',
					entitiesOptions,
				});
			})
			.catch((error) => {
				console.warn(
					`Composite Entities by Kind - on Change Entities: ${error}`
				);
			});
	};

	const onChangeKind = (kind: T) => {
		const entities = OrderedSet([]);
		setEntitiesAndKind({ kind, entities });
		props.kind.onChange(kind);
		props.entities.onChange(entities);

		props
			.searchEntities('', kind, {
				exclude: entitiesAndKind.entities,
			})
			.then((result) => {
				dispatch({
					type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS',
					contextualEntitiesOptions: result,
				});
				dispatch({
					type: 'UPDATE_ENTITIES_OPTIONS',
					entitiesOptions: result,
				});
				dispatch({
					type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
					selectedEntitiesOptions: entities,
				});
			})
			.catch((error) => {
				console.warn(
					`Composite Entities by Kind - on Change Kind: ${error}`
				);
			});
	};

	const entities: EntitiesSearch.EntitiesControl<P> = {
		...props.entities,
		value: entitiesAndKind.entities,
		options: orderSelectedOptionsAtTheTop<P>(
			uniqueControlOptions(
				state.selectedEntitiesOptions.merge(state.entitiesOptions)
			),
			entitiesAndKind.entities
		),
		onChange: onChangeEntities,
	};

	const kind: EntitiesSearch.KindControl<T> = {
		...props.kind,
		value: entitiesAndKind.kind,
		onChange: onChangeKind,
	};

	// TODO Add debouncing to the `search` callback
	const search = (phrase: SearchPhrase) => {
		const _phrase = extractPhrase(phrase);

		setSearchPhrase(_phrase);

		if (_phrase === '') {
			dispatch({
				type: 'UPDATE_ENTITIES_OPTIONS',
				entitiesOptions: state.contexualEntitiesOptions,
			});
			return;
		}

		searchEntitiesByKind(_phrase, entitiesAndKind.kind);
	};

	return <>{props.children(entities, kind, search)}</>;
}

function extractPhrase(phraseOrEvent: SearchPhrase): string {
	return typeof phraseOrEvent === 'string'
		? phraseOrEvent
		: phraseOrEvent.target.value;
}
