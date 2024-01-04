document.addEventListener('DOMContentLoaded', () => {
	const UNSUPPORTED_CPTS = ['attachment'];

	const { wp, entitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		searchEntities,
		KindRadioControl,
		EntitiesToggleControl,
		SearchControl,
		CompositeEntitiesByKind,
		useQueryViewablePostTypes,
		convertEntitiesToControlOptions,
	} = entitiesSearch;

	// TODO Check why the object form does not work.
	registerBlockType('widoz-entities-search/post-types-example-block', {
		apiVersion: 2,
		title: 'Post Types Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'widoz-entities-search-e2e-post-types-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'widoz-entities-search-e2e-post-types-example-block',
			});

			const postTypesEntities = useQueryViewablePostTypes();

			if (postTypesEntities.isResolving()) {
				return Spinner();
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
						value: Immutable.Set(props.attributes.posts),
						onChange: (posts) =>
							props.setAttributes({ posts: posts?.toArray() }),
					},
					kind: {
						value: props.attributes.postType,
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
							props.setAttributes({ postType }),
					},
				},
				(posts, type, search) => {
					return [
						createElement(KindRadioControl, {
							...type,
							key: 'post-type-radio',
						}),
						createElement(SearchControl, {
							onChange: search,
							key: 'search',
						}),
						createElement(EntitiesToggleControl, {
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
