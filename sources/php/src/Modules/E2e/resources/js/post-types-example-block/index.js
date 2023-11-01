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
		attributes: {
			posts: {
				type: 'array',
			},
			postType: {
				type: 'string',
			},
		},
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
						value: '',
						options: Immutable.Set([
							{
								label: 'Post 1',
								value: 'post-1',
							},
							{
								label: 'Post 2',
								value: 'post-2',
							},
							{
								label: 'Post 3',
								value: 'post-3',
							},
						]),
						onChange: (posts) => props.setAttributes({ posts }),
					},
					postType: {
						value: '',
						options: convertEntitiesToControlOptions(
							postTypesOptions.records()
						),
						onChange: (postType) => setValue({ postType }),
					},
				},
				(posts, type) => {
					return [
						createElement(PostTypeSelect, type),
						createElement(PostsSelect, posts),
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
