document.addEventListener('DOMContentLoaded', () => {
	const UNSUPPORTED_CPTS = ['attachment'];

	const { wp, entitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		searchPosts,
		PostTypeRadio,
		PostsToggle,
		Search,
		CompositePostsPostTypes,
		useQueryViewablePostTypes,
		convertPostTypeEntitiesToControlOptions,
		convertPostEntitiesToControlOptions,
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
				CompositePostsPostTypes,
				{
					// TODO Wrap around a throttle or debounce function
					searchPosts: async (phrase, postType, queryArguments) => {
						const postsEntities = await searchPosts(
							postType,
							phrase,
							queryArguments
						);
						return convertPostEntitiesToControlOptions(
							postsEntities,
							'title',
							'id'
						);
					},
					posts: {
						value: Immutable.Set(props.attributes.posts),
						onChange: (posts) =>
							props.setAttributes({ posts: posts?.toArray() }),
					},
					postType: {
						value: props.attributes.postType,
						options: convertPostTypeEntitiesToControlOptions(
							postTypesEntities
								.records()
								.filter(
									(record) =>
										!UNSUPPORTED_CPTS.includes(record.slug)
								)
						),
						onChange: (postType) =>
							props.setAttributes({ postType }),
					},
				},
				(posts, type, search) => {
					return [
						createElement(PostTypeRadio, {
							...type,
							key: 'post-type-radio',
						}),
						createElement(Search, { search, key: 'search' }),
						createElement(PostsToggle, {
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
