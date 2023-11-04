document.addEventListener('DOMContentLoaded', () => {
	const { wp, entitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		PostTypeSelect,
		PostsSelect,
		PostsPostTypesController,
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

			const postTypesOptions = useQueryViewablePostTypes();

			if (postTypesOptions.isResolving()) {
				return Spinner();
			}

			const PostPostTypesControllerElement = createElement(
				PostsPostTypesController,
				{
					posts: {
						value: null,
						postType: props.attributes.postType,
						// TODO Reintegrate the posts by posts type hook to pass the values at the first render
						options: Immutable.Set(),
						onChange: (posts) => props.setAttributes({ posts }),
					},
					postType: {
						value: props.attributes.postType,
						options: convertEntitiesToControlOptions(
							postTypesOptions.records()
						),
						onChange: (postType) =>
							props.setAttributes({ postType }),
					},
				},
				(posts, type) => {
					return [
						createElement(PostTypeSelect, {
							...type,
							key: 'post-type-select',
						}),
						createElement(PostsSelect, {
							...posts,
							key: 'posts-select',
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
