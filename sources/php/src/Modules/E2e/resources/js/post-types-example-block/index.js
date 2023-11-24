document.addEventListener('DOMContentLoaded', () => {
	const UNSUPPORTED_CPTS = ['attachment'];

	const { wp, entitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		searchPosts,
		PostTypeSelect,
		PostsSelect,
		PostsToggle,
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

			const postTypesOptions = useQueryViewablePostTypes();

			if (postTypesOptions.isResolving()) {
				return Spinner();
			}

			const PostPostTypesControllerElement = createElement(
				CompositePostsPostTypes,
				{
					// TODO Wrap around a throttle or debounce function
					searchPosts: async (phrase, postType) =>
						convertPostEntitiesToControlOptions(
							await searchPosts(postType, phrase)
						),
					posts: {
						value: Immutable.Set(props.attributes.posts),
						// TODO Reintegrate the posts by posts type hook to pass the values at the first render
						options: Immutable.Set([
							{ label: 'Sample Option 1', value: 120 },
							{ label: 'Entities Option 2', value: 3 },
							{ label: 'Option 3', value: 4 },
						]),
						onChange: (posts) =>
							props.setAttributes({ posts: posts?.toArray() }),
					},
					postType: {
						value: props.attributes.postType,
						options: convertPostTypeEntitiesToControlOptions(
							postTypesOptions
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
				(posts, type) => {
					return [
						createElement(
							'div',
							{
								className: 'wz-post-types-control-wrapper',
								key: 'post-type-select',
							},
							createElement(PostTypeSelect, type)
						),
						createElement(
							'div',
							{
								className: 'wz-posts-control-wrapper',
								key: 'posts-toggle',
							},
							createElement(PostsToggle, posts)
						),
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
