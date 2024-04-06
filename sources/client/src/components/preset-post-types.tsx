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
import { searchPosts } from '../api/search-posts';

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';

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
	entities: Entities;
	onChangeEntities: ( values: Entities ) => void;
	entitiesComponent: EntitiesComponent;
	kind: KindValue;
	kindOptions: EntitiesSearch.Options< string >;
	onChangeKind: ( values: KindValue ) => void;
	kindComponent: KindComponent;
	entitiesFields?: EntitiesSearch.QueryArguments[ 'fields' ];
};

interface InternalComponent
	extends Pick<
		EntitiesSearch.CompositeEntitiesKinds< EntitiesValue, string >,
		'kind' | 'entities'
	> {
	searchPosts: PostsFinder;
	kindComponent: KindComponent;
	entitiesComponent: EntitiesComponent;
}

function InternalComponent( props: InternalComponent ): JSX.Element {
	return (
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
	);
}

const withDataBound = createHigherOrderComponent<
	React.ComponentType< InternalComponent >,
	React.ComponentType< PublicComponentProps >
>(
	( Component ) => ( props ) => {
		const kindValue = narrowKindValue( props.kind );

		const entities = {
			value: props.entities,
			onChange: props.onChangeEntities,
		};

		const kind = {
			value: kindValue,
			options: props.kindOptions,
			onChange: props.onChangeKind,
		};

		const _searchPosts = postsFinderWithExtraFields(
			searchPosts,
			props.entitiesFields
		);

		return (
			<Component
				entities={ entities }
				kind={ kind }
				searchPosts={ _searchPosts }
				kindComponent={ props.kindComponent }
				entitiesComponent={ props.entitiesComponent }
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

export const PresetPostTypes = withDataBound( InternalComponent );
