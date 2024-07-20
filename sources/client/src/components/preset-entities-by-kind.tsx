/**
 * External dependencies
 */
import Kensaku from '@types';
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

type EntitiesValue = Kensaku.Value;
type Entities = Kensaku.Entities< EntitiesValue >;
type KindValue = Kensaku.Kind< string > | string;

type EntitiesFinder = (
	phrase: string,
	kind: Kensaku.Kind< string >,
	queryArguments?: Kensaku.QueryArguments
) => Promise< Set< Kensaku.ControlOption< EntitiesValue > > >;

type EntitiesComponent = React.ComponentType<
	Kensaku.BaseControl< EntitiesValue >
>;
type KindComponent = React.ComponentType< Kensaku.BaseControl< KindValue > >;

type PublicComponentProps = {
	entitiesFinder: EntitiesFinder;
	className?: string;
	entities: Entities;
	onChangeEntities: ( values: Entities ) => void;
	entitiesComponent: EntitiesComponent;
	kind: KindValue;
	kindOptions: Kensaku.Options< string >;
	onChangeKind: ( values: KindValue ) => void;
	kindComponent: KindComponent;
	entitiesFields?: Kensaku.QueryArguments[ 'fields' ];
};

interface PrivateComponentProps
	extends Pick<
		Kensaku.CompositeEntitiesKinds< EntitiesValue, string >,
		'kind' | 'entities'
	> {
	className?: string;
	entitiesFinder: EntitiesFinder;
	kindComponent: KindComponent;
	entitiesComponent: EntitiesComponent;
}

function PrivateComponent( props: PrivateComponentProps ): JSX.Element {
	const className = classnames( 'kensaku-preset-entities-by-kind', {
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
	entitiesFields?: Kensaku.QueryArguments[ 'fields' ]
): EntitiesFinder {
	return (
		phrase: string,
		kind: Kensaku.Kind< string >,
		queryArguments?: Kensaku.QueryArguments
	) =>
		entitiesFinder( phrase, kind, {
			...queryArguments,
			fields: [
				...( queryArguments?.fields ?? [ 'title', 'id' ] ),
				...( entitiesFields ?? [] ),
			],
		} );
}

function narrowKindValue( value: KindValue ): Kensaku.Kind< string > {
	return typeof value === 'string' ? new Set( [ value ] ) : value;
}

export const PresetEntitiesByKind = withDataBound( PrivateComponent );
