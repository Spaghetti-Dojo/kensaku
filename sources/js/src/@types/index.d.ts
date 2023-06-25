import { BaseEntityRecords } from '@wordpress/core-data';

export namespace EntitiesSearch {
	export type PostType<C> = BaseEntityRecords.Type<C>;

	export type EditablePostType = PostType<'edit'>;

	export type EditableViewablePostType = {
		[K in keyof EditablePostType]: K extends 'viewable'
			? true
			: EditablePostType[K];
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
		readonly options: ControlOption<string>[];
	}
}
