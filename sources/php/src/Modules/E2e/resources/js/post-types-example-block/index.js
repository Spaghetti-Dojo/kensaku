document.addEventListener('DOMContentLoaded', () => {
	const { wp, entitiesSearch } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		PostTypeSelect,
		PostsSelect,
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

			const options = useQueryViewablePostTypes();

			if (options.isResolving()) {
				return Spinner();
			}

			const PostTypeSelectElement = createElement(PostTypeSelect, {
				options: convertPostTypesToControlOptions(options.records()),
				value: props.attributes.postType,
				onChange: (postType) => props.setAttributes({ postType }),
			});

			const PostsSelectElement = createElement(PostsSelect, {
				postType: props.attributes.postType,
				values: props.attributes.posts,
				onChange: (posts) => props.setAttributes({ posts }),
			});

			return createElement(
				'div',
				blockProps,
				createElement(PostTypeSelect, {
					options: convertPostTypesToControlOptions(
						options.records()
					),
					value: props.attributes.postType,
					onChange: (postType) => props.setAttributes({ postType }),
				})
			);
		},
		save: () => null,
	});
});
