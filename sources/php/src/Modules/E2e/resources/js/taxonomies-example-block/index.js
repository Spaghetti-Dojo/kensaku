document.addEventListener('DOMContentLoaded', () => {
	const { wp, entitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		searchEntities,
		PostTypeRadio,
		PostsToggle,
		Search,
		CompositePostsPostTypes,
		useQueryViewableTaxonomies,
		convertEntitiesToControlOptions,
		convertPostEntitiesToControlOptions,
	} = entitiesSearch;

	// TODO Check why the object form does not work.
	registerBlockType('widoz-entities-search/taxonomies-example-block', {
		apiVersion: 2,
		title: 'Taxonomies Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'widoz-entities-search-e2e-taxonomies-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'widoz-entities-search-e2e-taxonomies-example-block',
			});

			const taxonomiesEntities = useQueryViewableTaxonomies();

			if (taxonomiesEntities.isResolving()) {
				return Spinner();
			}

			const TermTaxonomiesControllerElement = createElement(
				CompositePostsPostTypes,
				{
					// TODO Wrap around a throttle or debounce function
					searchEntities: async (
						phrase,
						entityName,
						queryArguments
					) => {
						const entities = await searchEntities(
							'term',
							entityName,
							phrase,
							queryArguments
						);
						return convertPostEntitiesToControlOptions(
							entities,
							'title',
							'id'
						);
					},
					posts: {
						value: Immutable.Set(props.attributes.terms),
						onChange: (terms) =>
							props.setAttributes({ terms: terms?.toArray() }),
					},
					postType: {
						value: props.attributes.taxonomy,
						options: convertEntitiesToControlOptions(
							taxonomiesEntities.records()
						),
						onChange: (taxonomy) =>
							props.setAttributes({ taxonomy }),
					},
				},
				(posts, type, search) => {
					return [
						createElement(PostTypeRadio, {
							...type,
							key: 'taxonomy-radio',
						}),
						createElement(Search, { search, key: 'search' }),
						createElement(PostsToggle, {
							...posts,
							key: 'terms-toggle',
						}),
					];
				}
			);

			return createElement(
				'div',
				blockProps,
				TermTaxonomiesControllerElement
			);
		},
		save: () => null,
	});
});
