document.addEventListener('DOMContentLoaded', () => {
	const UNSUPPORTED_CPTS = ['attachment'];

	const { wp, kensaku } = window;

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
		PresetEntitiesByKind,
		ToggleControl,
		SearchControl,
		CompositeEntitiesByKind,
		useQueryViewablePostTypes,
		convertEntitiesToControlOptions,
		createSearchEntitiesOptions,
	} = kensaku;

	// TODO Check why the object form does not work.
	registerBlockType('kensaku/post-types-example-block', {
		apiVersion: 2,
		title: 'Post Types Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'kensaku-e2e-post-types-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'kensaku-e2e-post-types-example-block',
			});

			const postTypesEntities = useQueryViewablePostTypes();

			if (postTypesEntities.isResolving()) {
				return createElement(Spinner);
			}

			const searchPosts = createSearchEntitiesOptions( 'post' );

			const PostPostTypesControllerElement = createElement(
			  PresetEntitiesByKind,
				{
					entitiesFinder: searchPosts,
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
