/**
 * External dependencies
 */
import type EntitiesSearch from '@types';
import React, { JSX } from 'react';

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { useEntitiesOptionsStorage } from '../hooks/use-entities-options-storage';
import { useSearch } from '../hooks/use-search';
import { orderSelectedOptionsAtTheTop } from '../utils/order-selected-options-at-the-top';
import { uniqueControlOptions } from '../utils/unique-control-options';
import { Set } from '../models/set';

/**
 * A composite component that provides a way to search for entities by kind.
 *
 * @public
 * @param props The component props.
 */
export function CompositeEntitiesByKind< E, K >(
	props: EntitiesSearch.CompositeEntitiesKinds< E, K >
): JSX.Element {
	const [ state, dispatch ] = useEntitiesOptionsStorage< E, K >(
		{
			entities: props.entities.value,
			kind: props.kind.value,
		},
		props.searchEntities
	);
	const search = useSearch< E, K >(
		props.searchEntities,
		state.kind,
		state.entities,
		dispatch
	);

	const onChangeEntities = ( entities: EntitiesSearch.Entities< E > ) => {
		props.entities.onChange( entities );

		if ( entities.length() <= 0 ) {
			dispatch( {
				type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
				selectedEntitiesOptions: new Set(),
			} );
			return;
		}

		Promise.all( [
			props.searchEntities( state.searchPhrase, state.kind, {
				exclude: entities,
			} ),
			props.searchEntities( '', state.kind, {
				include: entities,
				per_page: '-1',
			} ),
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
					'wp-entities-search.on-change-entities.error',
					error
				);
			} );
	};

	const onChangeKind = ( kind: EntitiesSearch.Kind< K > ) => {
		const emptySet = new Set< any >();

		props.kind.onChange( kind );
		props.entities.onChange( emptySet );

		if ( kind.length() <= 0 ) {
			dispatch( {
				type: 'CLEAN_ENTITIES_OPTIONS',
			} );
			dispatch( { type: 'UPDATE_KIND', kind } );
			return;
		}

		props
			.searchEntities( state.searchPhrase, kind, {
				exclude: state.entities,
			} )
			.then( ( entitiesOptions ) => {
				dispatch( {
					type: 'UPDATE_ENTITIES_OPTIONS_FOR_NEW_KIND',
					entitiesOptions,
					kind,
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: 'CLEAN_ENTITIES_OPTIONS',
				} );
				doAction( 'wp-entities-search.on-change-kind.error', error );
			} );
	};

	const entities: EntitiesSearch.BaseControl< E > = {
		...props.entities,
		value: state.entities,
		options: orderSelectedOptionsAtTheTop< E >(
			uniqueControlOptions(
				state.selectedEntitiesOptions.concat(
					state.currentEntitiesOptions
				)
			),
			state.entities
		),
		onChange: onChangeEntities,
	};

	const kind: EntitiesSearch.BaseControl< K > = {
		...props.kind,
		value: state.kind,
		onChange: onChangeKind,
	};

	return <>{ props.children( entities, kind, search ) }</>;
}

// A Comment
