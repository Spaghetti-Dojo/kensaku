/**
 * External dependencies
 */
import EntitiesSearch from '@types';
import React, { JSX } from 'react';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { CompositeEntitiesByKind } from './composite-entities-by-kind';
import { SearchControl } from './search-control';
import { Set } from '../models/set';

type EntitiesValue = EntitiesSearch.Value;
type Entities = EntitiesSearch.Entities< EntitiesValue >;
type KindValue = EntitiesSearch.Kind< string > | string;

type EntitiesFinder = (
	phrase: string,
	kind: EntitiesSearch.Kind< string >,
	queryArguments?: EntitiesSearch.QueryArguments
) => Promise< Set< EntitiesSearch.ControlOption< EntitiesValue > > >;

type EntitiesComponent = React.ComponentType<
	EntitiesSearch.BaseControl< EntitiesValue >
>;
type KindComponent = React.ComponentType<
	EntitiesSearch.BaseControl< KindValue >
>;

type PublicComponentProps = {
	entitiesFinder: EntitiesFinder;
	className?: string;
	entities: Entities;
	onChangeEntities: ( values: Entities ) => void;
	entitiesComponent: EntitiesComponent;
	kind: KindValue;
	kindOptions: EntitiesSearch.Options< string >;
	onChangeKind: ( values: KindValue ) => void;
	kindComponent: KindComponent;
	entitiesFields?: EntitiesSearch.QueryArguments[ 'fields' ];
};

interface PrivateComponentProps
	extends Pick<
		EntitiesSearch.CompositeEntitiesKinds< EntitiesValue, string >,
		'kind' | 'entities'
	> {
	className?: string;
	entitiesFinder: EntitiesFinder;
	kindComponent: KindComponent;
	entitiesComponent: EntitiesComponent;
}

function PrivateComponent( props: PrivateComponentProps ): JSX.Element {
	const className = classnames( 'wes-preset-entities-by-kind', {
		// @ts-ignore
		[ props.className ]: !! props.className,
	} );

	return (
		<div className={ className }>
			<CompositeEntitiesByKind
				entities={ props.entities }
				kind={ props.kind }
				searchEntities={ props.entitiesFinder }
			>
				{ ( _entities, _kind, search ) => (
					<>
						<props.kindComponent { ..._kind } />
						<SearchControl onChange={ search } />
						<props.entitiesComponent { ..._entities } />
					</>
				) }
			</CompositeEntitiesByKind>
		</div>
	);
}

const withDataBound = createHigherOrderComponent<
	React.ComponentType< PrivateComponentProps >,
	React.ComponentType< PublicComponentProps >
>(
	( Component ) => ( props ) => {
		const {
			kind,
			entities,
			onChangeEntities,
			kindOptions,
			onChangeKind,
			entitiesFields,
			kindComponent,
			entitiesComponent,
			entitiesFinder,
			..._props
		} = props;

		const kindValue = narrowKindValue( props.kind );

		const _entities = {
			value: entities,
			onChange: onChangeEntities,
		};

		const _kind = {
			value: kindValue,
			options: kindOptions,
			onChange: onChangeKind,
		};

		const _entitiesFinder = entitiesFinderWithExtraFields(
			entitiesFinder,
			entitiesFields
		);

		return (
			<Component
				entities={ _entities }
				kind={ _kind }
				entitiesFinder={ _entitiesFinder }
				kindComponent={ kindComponent }
				entitiesComponent={ entitiesComponent }
				{ ..._props }
			/>
		);
	},
	'withDataBound'
);

function entitiesFinderWithExtraFields(
	entitiesFinder: EntitiesFinder,
	entitiesFields?: EntitiesSearch.QueryArguments[ 'fields' ]
): EntitiesFinder {
	return (
		phrase: string,
		kind: EntitiesSearch.Kind< string >,
		queryArguments?: EntitiesSearch.QueryArguments
	) =>
		entitiesFinder( phrase, kind, {
			...queryArguments,
			fields: [
				...( queryArguments?.fields ?? [ 'title', 'id' ] ),
				...( entitiesFields ?? [] ),
			],
		} );
}

function narrowKindValue( value: KindValue ): EntitiesSearch.Kind< string > {
	return typeof value === 'string' ? new Set( [ value ] ) : value;
}

export const PresetEntitiesByKind = withDataBound( PrivateComponent );
