import type { OrderedSet } from 'immutable';
import React from 'react';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

export default EntitiesSearch;

declare namespace EntitiesSearch {
	type Post<C extends Context = 'view'> = BaseEntityRecords.Post<C>;
	type PostType<C extends Context = 'view'> = BaseEntityRecords.Type<C>;
	type Taxonomy<C extends Context = 'view'> = BaseEntityRecords.Taxonomy<C>;

	interface SearchEntityFields
		extends Readonly<{
			id: number;
			title: string;
			url: string;
			type: string;
			subtype: string;
		}> {}

	type ControlOption<V extends any> = Readonly<{
		value: V;
		label: string;
	}>;

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
		records(): OrderedSet<Entity>;
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
	type EntitiesState<CO> = Readonly<{
		contexualEntitiesOptions: OrderedSet<EntitiesSearch.ControlOption<CO>>;
		entitiesOptions: EntitiesState<CO>['contexualEntitiesOptions'];
		selectedEntitiesOptions: EntitiesState<CO>['entitiesOptions'];
	}>;

	type EntitiesAction<V> =
		| {
				type: 'UPDATE_ENTITIES_OPTIONS';
				entitiesOptions: EntitiesState<V>['entitiesOptions'];
		  }
		| {
				type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS';
				contextualEntitiesOptions: EntitiesState<V>['contexualEntitiesOptions'];
		  }
		| {
				type: 'UPDATE_SELECTED_ENTITIES_OPTIONS';
				selectedEntitiesOptions: EntitiesState<V>['selectedEntitiesOptions'];
		  };

	/*
	 * Components
	 */
	interface KindControl<V>
		extends Readonly<{
			value: V;
			options: OrderedSet<ControlOption<V>>;
			className?: string;
			onChange(value: KindControl<V>['value']): void;
		}> {}

	interface EntitiesControl<V>
		extends Readonly<{
			value?: OrderedSet<V> | undefined;
			options: OrderedSet<ControlOption<V>>;
			className?: string;
			onChange(values: EntitiesControl<V>['value']): void;
		}> {}

	interface SearchControl
		extends Readonly<{
			id?: string;
			onChange(phrase: string | React.ChangeEvent<HTMLInputElement>);
		}> {}

	interface CompositeEntitiesKinds<P, T>
		extends Readonly<{
			kind: KindControl<T>;
			entities: Omit<EntitiesControl<P>, 'options'>;
			searchEntities: (
				phrase: string,
				kind: KindControl<T>['value'],
				queryArguments?: Record<string, unknown>
			) => Promise<EntitiesControl<P>['options']>;
			children(
				entities: EntitiesControl<P>,
				kind: CompositeEntitiesKinds<P, T>['kind'],
				search: (
					phrase: Parameters<SearchControl<P, T>['search']>[0]
				) => ReturnType<SearchControl<P, T>['search']>
			): React.ReactNode;
		}> {}
}
