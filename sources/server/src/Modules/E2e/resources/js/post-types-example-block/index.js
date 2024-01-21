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
		PluralSelectControl,
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
				CompositeEntitiesByKind,
				{
					// TODO Wrap around a throttle or debounce function
					searchEntities: async (
						phrase,
						postType,
						queryArguments
					) => {
						const postsEntities = await searchEntities(
							'post',
							postType,
							phrase,
							queryArguments
						);
						return convertEntitiesToControlOptions(
							postsEntities,
							'title',
							'id'
						);
					},
					entities: {
						value: new Set(props.attributes.posts),
						onChange: (posts) =>
							props.setAttributes({ posts: posts.toArray() }),
					},
					kind: {
						value: new Set(props.attributes.postType),
						options: convertEntitiesToControlOptions(
							postTypesEntities
								.records()
								.filter(
									(record) =>
										!UNSUPPORTED_CPTS.includes(record.slug)
								),
							'name',
							'slug'
						),
						onChange: (postType) =>
							props.setAttributes({
								postType: postType.toArray(),
							}),
					},
				},
				(posts, type, search) => {
					return [
						createElement(ToggleControl, {
							...type,
							key: 'post-type-radio',
						}),
						createElement(SearchControl, {
							onChange: search,
							key: 'search',
						}),
						createElement(ToggleControl, {
							...posts,
							key: 'posts-toggle',
						}),
					];
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
