import { BaseEntityRecords } from '@wordpress/core-data';

export namespace EntitiesSearch {
	type PostType<C> = BaseEntityRecords.Type<C>;

	type EditablePostType = PostType<'edit'>;

	type EditableViewablePostType = {
		[K in keyof EditablePostType]: K extends 'viewable'
			? true
			: EditablePostType[K];
	};

	type ControlOption<V extends any> = Readonly<{
		value: V;
		label: string;
	}>;

	/**
	 * Components
	 */
	interface PostTypeSelect {
		readonly options: ControlOption<string>[];
	}
}
