/**
 * WordPress dependencies
 */
import { addAction } from '@wordpress/hooks';

/* eslint-disable no-console */

addAction(
	'wp-entities-search.on-change-entities.error',
	'wp-entities-search/wp-on-change-entities.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind - on Change Entities: ${
				new Error( error ).message
			}`
		);
	}
);

addAction(
	'wp-entities-search.on-change-kind.error',
	'wp-entities-search/wp-on-change-entities.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind - on Change Kind: ${
				error.message ?? error
			}`
		);
	}
);

addAction(
	'wp-entities-search.on-storage-initialization.error',
	'wp-entities-search/on-storage-initialization.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind: ${ error.message ?? error }`
		);
	}
);

addAction(
	'wp-entities-search.on-search.error',
	'wp-entities-search/on-search.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind - on Search Entities: ${
				error.message ?? error
			}`
		);
	}
);
