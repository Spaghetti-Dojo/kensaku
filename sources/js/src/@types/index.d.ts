import type { Set } from 'immutable';

import { BaseEntityRecords, Context } from '@wordpress/core-data';

export namespace EntitiesSearch {
	export type PostType<C extends Context = 'view'> =
		BaseEntityRecords.Type<C>;

	export type ViewablePostType = {
		[K in keyof PostType]: K extends 'viewable' ? true : PostType[K];
	};

	export type ControlOption<V extends any> = Readonly<{
		value: V;
		label: string;
	}>;

	export type EntitiesRecords<RecordType> = {
		records: RecordType[] | null;
	} & ResolveStatus;

	export type ResolveStatus = Readonly<{
		isResolving(): boolean;
		isIdle(): boolean;
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
