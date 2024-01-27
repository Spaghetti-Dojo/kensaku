import React from 'react';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

import type { Set } from '../sources/client/src';

export default EntitiesSearch;

// TODO Try to convert it to a module.
declare namespace EntitiesSearch {
	type Post<C extends Context = 'view'> = BaseEntityRecords.Post<C>;
	type PostType<C extends Context = 'view'> = BaseEntityRecords.Type<C>;
	type Taxonomy<C extends Context = 'view'> = BaseEntityRecords.Taxonomy<C>;

	type Entities<V> = Set<V>;
	type Kind<V> = Set<V>;
	type Options<V> = Set<ControlOption<V>>;

	interface QueryArguments<V>
		extends Partial<
			Readonly<{
				exclude: Set<V>;
				include: Set<V>;
				fields: EntitiesSearch.SearchQueryFields;
				[p: string]: unknown;
			}>
		> {}

	interface SearchEntityFields
		extends Readonly<{
			id: number;
			title: string;
			url: string;
			type: string;
			subtype: string;
		}> {}

	type SearchEntitiesFunction<E, K> = (
		phrase: string,
		kind: Kind<K>,
		queryArguments?: EntitiesSearch.QueryArguments<E>
	) => Promise<Options<E>>;

	type ControlOption<V extends any> = Readonly<{
		value: V;
		label: string;
	}>;

	type SingularControl<V> = {
		[K in keyof BaseControl<V>]: K extends 'value'
			? V
			: K extends 'onChange'
			? (value: V) => void
			: BaseControl<V>[K];
	};

	interface BaseControl<V>
		extends Readonly<{
			value: Set<V>;
			options: Options<V>;
			onChange(values: BaseControl<V>['value']): void;
		}> {}

	/*
	 * Hooks
	 */
	type ViewablePostType = Readonly<{
		[K in keyof PostType<'edit'>]: K extends 'viewable'
			? true
			: PostType<'edit'>[K];
	}>;

	// TODO Need Type Test.
	type ViewableTaxonomy = Readonly<{
		[K in keyof Taxonomy<'edit'>]: K extends 'visibility'
			? BaseEntityRecords.TaxonomyVisibility & {
					publicly_queryable: true;
			  }
			: Taxonomy<'edit'>[K];
	}>;

	type EntitiesRecords<Entity> = Readonly<{
		records(): Set<Entity>;
		isResolving(): boolean;
		errored(): boolean;
		succeed(): boolean;
	}>;

	/*
	 * Api
	 */
	type SearchQueryFields = ReadonlyArray<
		keyof EntitiesSearch.SearchEntityFields
	>;

	/*
	 * Storage
	 */
	interface EntitiesState<
		E,
		K,
		OptionSet = Set<EntitiesSearch.ControlOption<E>>
	> extends Readonly<{
			entities: Entities<E>;
			kind: Kind<K>;
			contextualEntitiesOptions: OptionSet;
			currentEntitiesOptions: OptionSet;
			selectedEntitiesOptions: OptionSet;
			searchPhrase: string;
		}> {}

	type StoreAction<E, K> =
		| {
				type: 'UPDATE_ENTITIES';
				entities: EntitiesState<E, K>['entities'];
		  }
		| {
				type: 'UPDATE_KIND';
				kind: EntitiesState<E, K>['kind'];
		  }
		| {
				type: 'UPDATE_CURRENT_ENTITIES_OPTIONS';
				currentEntitiesOptions: EntitiesState<
					E,
					K
				>['currentEntitiesOptions'];
		  }
		| {
				type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS';
				contextualEntitiesOptions: EntitiesState<
					E,
					K
				>['contextualEntitiesOptions'];
		  }
		| {
				type: 'UPDATE_SELECTED_ENTITIES_OPTIONS';
				selectedEntitiesOptions: EntitiesState<
					E,
					K
				>['selectedEntitiesOptions'];
		  }
		| {
				type: 'CLEAN_ENTITIES_OPTIONS';
		  }
		| {
				type: 'UPDATE_ENTITIES_OPTIONS_FOR_NEW_KIND';
				entitiesOptions: Set<EntitiesSearch.ControlOption<E>>;
				kind: EntitiesState<E, K>['kind'];
		  }
		| {
				type: 'UPDATE_SEARCH_PHRASE';
				searchPhrase: string;
		  };

	/*
	 * Components
	 */
	interface SearchControl
		extends Readonly<{
			id?: string;
			onChange(phrase: string | React.ChangeEvent<HTMLInputElement>);
		}> {}

	interface CompositeEntitiesKinds<E, K>
		extends Readonly<{
			kind: BaseControl<K>;
			entities: Omit<BaseControl<E>, 'options'>;
			searchEntities: SearchEntitiesFunction<E, K>;
			children(
				entities: CompositeEntitiesKinds<E, K>['entities'] & {
					options: BaseControl<E>['options'];
				},
				kind: CompositeEntitiesKinds<E, K>['kind'],
				search: (
					phrase: Parameters<SearchEntitiesFunction<E, K>>[0]
				) => ReturnType<SearchControl<E, K>['search']>
			): React.ReactNode;
		}> {}
}
