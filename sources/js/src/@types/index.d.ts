import type { Set } from 'immutable';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

export = EntitiesSearch;
export as namespace EntitiesSearch;

declare namespace EntitiesSearch {
	export const enum ResolveStatus {
		ERROR = 'ERROR',
		SUCCESS = 'SUCCESS',
		RESOLVING = 'RESOLVING',
	}

	export type PostType<C extends Context = 'view'> =
		BaseEntityRecords.Type<C>;

	export type ViewablePostType = Readonly<{
		[K in keyof PostType<'edit'>]: K extends 'viewable'
			? true
			: PostType<'edit'>[K];
	}>;

	export type ControlOption<V extends any> = Readonly<{
		value: V;
		label: string;
	}>;

	export type EntitiesRecords<Entity> = Readonly<{
		records(): Set<Entity>;
		isResolving(): boolean;
		errored(): boolean;
		succeed(): boolean;
	}>;

	/**
	 * Components
	 */
	export interface PostTypeSelect {
		readonly options: Set<ControlOption<string>>;
	}
}
