/**
 * External dependencies
 */
import EntitiesSearch from '@types';

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { abortControllers } from '../services/abort-controllers';
import { ContextualAbortController } from '../services/contextual-abort-controller';
import { Set } from '../models/set';
import { fetch } from './fetch';

export async function searchEntities< E >(
	type: string,
	subtype: Set< string >,
	phrase: string,
	queryArguments?: EntitiesSearch.QueryArguments< string >
): Promise< Set< E > > {
	const {
		exclude,
		include,
		fields = [ 'title', 'id' ],
		...restArguments
	} = queryArguments ?? {};

	// @ts-ignore we need to pass string[] to the URLSearchParams
	const params = new URLSearchParams( {
		per_page: '10',
		order: 'DESC',
		orderBy: 'title',
		...{
			exclude: exclude?.toArray() ?? [],
			include: include?.toArray() ?? [],
			...restArguments,
		},
		type,
		search: phrase,
		subtype: subtype.toArray(),
		_fields: serializeFields( fields ),
	} ).toString();

	const controller = abortControllers.add(
		new ContextualAbortController(
			params,
			`Request aborted with parameters: ${ params }`
		)
	);

	const entities = await fetch< ReadonlyArray< E > >( {
		path: `?rest_route=/wp/v2/search&${ params }`,
		signal: controller?.signal() ?? null,
	} ).catch( ( error ) => {
		if ( error instanceof DOMException && error.name === 'AbortError' ) {
			doAction( 'wp-entities-search.on-search.abort', error );
		}

		throw error;
	} );

	return new Set( entities );
}

function serializeFields( fields: EntitiesSearch.SearchQueryFields ): string {
	return fields.join( ',' );
}
