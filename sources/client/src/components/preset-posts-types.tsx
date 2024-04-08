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
import { searchPosts } from '../api/search-posts';

type EntitiesValue = EntitiesSearch.Value;
type Entities = EntitiesSearch.Entities< EntitiesValue >;
type KindValue = EntitiesSearch.Kind< string > | string;
type PostsFinder = typeof searchPosts;

type EntitiesComponent = React.ComponentType<
	EntitiesSearch.BaseControl< EntitiesValue >
>;
type KindComponent = React.ComponentType<
	EntitiesSearch.BaseControl< KindValue >
>;

type PublicComponentProps = {
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
	searchPosts: PostsFinder;
	kindComponent: KindComponent;
	entitiesComponent: EntitiesComponent;
}

function PrivateComponent( props: PrivateComponentProps ): JSX.Element {
	const className = classnames( 'wes-preset-posts-types', {
		// @ts-ignore
		[ props.className ]: !! props.className,
	} );

	return (
		<div className={ className }>
			<CompositeEntitiesByKind
				entities={ props.entities }
				kind={ props.kind }
				searchEntities={ props.searchPosts }
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

		const _searchPosts = postsFinderWithExtraFields(
			searchPosts,
			entitiesFields
		);

		return (
			<Component
				entities={ _entities }
				kind={ _kind }
				searchPosts={ _searchPosts }
				kindComponent={ kindComponent }
				entitiesComponent={ entitiesComponent }
				{ ..._props }
			/>
		);
	},
	'withDataBound'
);

function postsFinderWithExtraFields(
	postsFinder: PostsFinder,
	entitiesFields?: EntitiesSearch.QueryArguments[ 'fields' ]
): PostsFinder {
	return (
		phrase: string,
		postTypes: EntitiesSearch.Kind< string >,
		queryArguments?: EntitiesSearch.QueryArguments
	) =>
		postsFinder( phrase, postTypes, {
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

export const PresetPostsTypes = withDataBound( PrivateComponent );
