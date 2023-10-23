document.addEventListener('DOMContentLoaded', () => {
	const { wp, entitiesSearch } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		PostTypeSelect,
		PostsSelect,
		PostsPostTypesController,
		useQueryViewablePostTypes,
		convertPostTypesToControlOptions,
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

			const PostTypeSelectStateAware = ({ value, setValue }) =>
				createElement(PostTypeSelect, {
					options: convertPostTypesToControlOptions(
						postTypesOptions.records()
					),
					value,
					onChange: (postType) => setValue([postType]),
				});

			// TODO Convert posts to Control Options.
			const PostSelectStateAware = ({ value, setValue }) =>
				createElement(PostsSelect, {
					options: {
						options: [
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
						],
						first() {
							return this.options[0];
						},
						find(callback) {
							return this.options.find(callback);
						},
						toArray() {
							return this.options;
						},
					},
					value,
					onChange: (posts) => setValue(posts),
				});

			const PostPostTypesControllerElement = createElement(
				PostsPostTypesController,
				{
					postsComponent: PostSelectStateAware,
					typesComponent: PostTypeSelectStateAware,
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
