/**
 * WordPress dependencies
 */
import { addAction } from '@wordpress/hooks';

/* eslint-disable no-console */

addAction(
	'kensaku.on-change-entities.error',
	'kensaku/wp-on-change-entities.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind - on Change Entities: ${
				new Error( error ).message
			}`
		);
	}
);

addAction(
	'kensaku.on-change-kind.error',
	'kensaku/wp-on-change-entities.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind - on Change Kind: ${
				error.message ?? error
			}`
		);
	}
);

addAction(
	'kensaku.on-storage-initialization.error',
	'kensaku/on-storage-initialization.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind: ${ error.message ?? error }`
		);
	}
);

addAction(
	'kensaku.on-search.error',
	'kensaku/on-search.error',
	( error ) => {
		console.error(
			`Composite Entities by Kind - on Search Entities: ${
				error.message ?? error
			}`
		);
	}
);
