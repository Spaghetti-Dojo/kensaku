/**
 * External dependencies
 */
import EntitiesSearch from '@types';

export class ImmutableRecord< T > implements EntitiesSearch.Record< T > {
	readonly #map: Record< string, T > = {};

	public constructor( map: Record< string, T > = {} ) {
		this.#map = map;
	}

	public get< F >( key: string, fallback?: F ): T | F | undefined {
		return this.#map[ key ] ?? fallback;
	}

	public set( key: string, value: T ): ImmutableRecord< T > {
		return new ImmutableRecord( { ...this.#map, [ key ]: value } );
	}
}
