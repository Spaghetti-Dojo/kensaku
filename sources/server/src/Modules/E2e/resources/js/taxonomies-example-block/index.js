document.addEventListener('DOMContentLoaded', () => {
	const { wp, kensaku, Immutable } = window;

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
		useQueryViewableTaxonomies,
		convertEntitiesToControlOptions,
		createSearchEntitiesOptions,
	} = kensaku;

	// TODO Check why the object form does not work.
	registerBlockType('kensaku/taxonomies-example-block', {
		apiVersion: 2,
		title: 'Taxonomies Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'kensaku-e2e-taxonomies-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'kensaku-e2e-taxonomies-example-block',
			});

			const taxonomiesEntities = useQueryViewableTaxonomies();

			if (taxonomiesEntities.isResolving()) {
				return createElement(Spinner);
			}

			const entitiesFinder = createSearchEntitiesOptions( 'term' );

			const TermTaxonomiesControllerElement = createElement(
			  PresetEntitiesByKind,
			  {
				  entitiesFinder: entitiesFinder,
				  entities: new Set(props.attributes.terms),
				  onChangeEntities: (entities) =>
					props.setAttributes({ terms: entities.toArray() }),
				  entitiesComponent: ToggleControl,

				  kind: new Set(props.attributes.taxonomy),
				  kindOptions: convertEntitiesToControlOptions(
					taxonomiesEntities.records(),
					'name',
					'slug'
				  ),
				  onChangeKind: (kind) =>
					props.setAttributes({
						taxonomy: kind.toArray(),
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
			  TermTaxonomiesControllerElement
			);
		},
		save: () => null,
	});
});
