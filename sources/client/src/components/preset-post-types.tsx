/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import React, { JSX } from 'react';

/**
 * Internal dependencies
 */
import { CompositeEntitiesByKind } from './composite-entities-by-kind';
import { SearchControl } from './search-control';
import { Set } from '../models/set';

type EntitiesValue = EntitiesSearch.Value;
type Entities = EntitiesSearch.Entities< EntitiesValue >;
type KindValue = EntitiesSearch.Kind< string > | string;

type Props = {
	entities: Entities;
	onChangeEntities: ( values: Entities ) => void;
	entitiesComponent: React.ComponentType<
		EntitiesSearch.BaseControl< EntitiesValue >
	>;
	kind: KindValue;
	kindOptions: EntitiesSearch.Options< string >;
	onChangeKind: ( values: KindValue ) => void;
	kindComponent: React.ComponentType<
		EntitiesSearch.BaseControl< KindValue >
	>;
	search: EntitiesSearch.SearchEntitiesFunction< EntitiesValue, KindValue >;
};

export function PresetPostTypes( props: Props ): JSX.Element {
	const kindValue = ensureKindValue( props.kind );

	return (
		<CompositeEntitiesByKind< EntitiesSearch.Value, string >
			entities={ {
				value: props.entities,
				onChange: props.onChangeEntities,
			} }
			kind={ {
				value: kindValue,
				options: props.kindOptions,
				onChange: props.onChangeKind,
			} }
			searchEntities={ props.search }
		>
			{ ( entities, kind, search ) => (
				<>
					<props.kindComponent { ...kind } />
					<SearchControl onChange={ search } />
					<props.entitiesComponent { ...entities } />
				</>
			) }
		</CompositeEntitiesByKind>
	);
}

function ensureKindValue( value: KindValue ): EntitiesSearch.Kind< string > {
	return typeof value === 'string' ? new Set( [ value ] ) : value;
}
