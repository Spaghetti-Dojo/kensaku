import {PresetPostsTypes} from '../../../../../../../client/src/components/preset-posts-types'

document.addEventListener('DOMContentLoaded', () => {
	const UNSUPPORTED_CPTS = ['attachment'];

	const { wp, wpEntitiesSearch } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		Set,
		searchEntities,
		SingularSelectControl,
		PluralSelectControl,
		RadioControl,
		PresetPostsTypes,
		ToggleControl,
		SearchControl,
		CompositeEntitiesByKind,
		useQueryViewablePostTypes,
		convertEntitiesToControlOptions,
	} = wpEntitiesSearch;

	// TODO Check why the object form does not work.
	registerBlockType('wp-entities-search/post-types-example-block', {
		apiVersion: 2,
		title: 'Post Types Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'wp-entities-search-e2e-post-types-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'wp-entities-search-e2e-post-types-example-block',
			});

			const postTypesEntities = useQueryViewablePostTypes();

			if (postTypesEntities.isResolving()) {
				return createElement(Spinner);
			}

			const PostPostTypesControllerElement = createElement(
			  PresetPostsTypes,
				{
					entities: new Set(props.attributes.posts),
					onChangeEntities: (posts) =>
					  props.setAttributes({ posts: posts.toArray() }),
					entitiesComponent: ToggleControl,

					kind: new Set(props.attributes.postType),
					kindOptions: convertEntitiesToControlOptions(
					  postTypesEntities
						.records()
						.filter(
						  (record) =>
							!UNSUPPORTED_CPTS.includes(record.slug)
						),
					  'name',
					  'slug'
					),
					onChangeKind: (postType) =>
					  props.setAttributes({
						  postType: postType.toArray(),
					  }),
					kindComponent: ToggleControl,

					entitiesFields: [
					  'title',
					  'id',
					  'post_content'
					]
				}
			);

			return createElement(
				'div',
				blockProps,
				PostPostTypesControllerElement
			);
		},
		save: () => null,
	});
});
