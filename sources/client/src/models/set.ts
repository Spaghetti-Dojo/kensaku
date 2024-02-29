/**
 * External dependencies
 */
import { isEqual as _isEqual } from 'lodash';

export class Set< T > {
	readonly #data: ReadonlyArray< T >;

	public constructor( data: ReadonlyArray< T > = [] ) {
		this.#data = this.ensureUnique( data );
	}

	public add( value: T ): Set< T > {
		if ( this.has( value ) ) {
			return this;
		}

		return new Set( [ ...this.#data, value ] );
	}

	public delete( value: T ): Set< T > {
		if ( ! this.has( value ) ) {
			return this;
		}

		return new Set(
			this.#data.filter( ( item ) => ! this.isEqual( item, value ) )
		);
	}

	public has( value: T ): boolean {
		return this._has( value, this.#data );
	}

	public map< R = T >( fn: ( value: T ) => R ): Set< R > {
		return new Set( this.#data.map( fn ) );
	}

	public toArray(): ReadonlyArray< T > {
		return Object.freeze( [ ...this.#data ] );
	}

	public forEach( fn: ( value: T ) => void ): void {
		this.#data.forEach( fn );
	}

	public length(): number {
		return this.#data.length;
	}

	public concat( set: Set< T > ): Set< T > {
		return new Set( [ ...this.#data, ...set.toArray() ] );
	}

	public filter( fn: ( value: T ) => boolean ): Set< T > {
		return new Set( this.#data.filter( fn ) );
	}

	public find( fn: ( value: T ) => boolean ): T | undefined {
		return this.#data.slice( 0 ).find( fn );
	}

	public first(): T | undefined {
		return this.#data.slice( 0 )[ 0 ];
	}

	public last(): T | undefined {
		return this.#data.slice( -1 )[ 0 ];
	}

	public copy( start: number, end: number ): Set< T > {
		return new Set( this.#data.slice( start, end ) );
	}

	public equals( set: Set< T > ): boolean {
		if ( this.length() !== set.length() ) {
			return false;
		}

		if ( this === set ) {
			return true;
		}

		for ( const value of this ) {
			if ( ! set.has( value ) ) {
				return false;
			}
		}

		return true;
	}

	public *[ Symbol.iterator ]() {
		for ( const value of this.#data ) {
			yield value;
		}
	}

	private isEqual( a: unknown, b: unknown ): boolean {
		return _isEqual( a, b );
	}

	private _has( value: T, data: ReadonlyArray< T > ): boolean {
		return data.some( ( current ) => this.isEqual( current, value ) );
	}

	private ensureUnique( data: ReadonlyArray< T > ): ReadonlyArray< T > {
		const accumulator: Array< T > = [];
		return data.reduce( ( acc, value ) => {
			if ( ! this._has( value, acc ) ) {
				acc.push( value );
			}

			return acc;
		}, accumulator );
	}
}
