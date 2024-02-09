import { isEqual } from 'lodash';

export class Set<T> {
	readonly #data: ReadonlyArray<T>;

	public constructor(data: ReadonlyArray<T> = []) {
		this.#data = data;
	}

	public add(value: T): Set<T> {
		if (this.has(value)) {
			return this;
		}

		return new Set([...this.#data, value]);
	}

	public delete(value: T): Set<T> {
		if (!this.has(value)) {
			return this;
		}

		return new Set(this.#data.filter((item) => !this.isEqual(item, value)));
	}

	public has(value: T): boolean {
		return this.#data.some((current) => this.isEqual(current, value));
	}

	public map<R = T>(fn: (value: T) => R): Set<R> {
		return new Set(this.#data.map(fn));
	}

	public toArray(): Array<T> {
		return [...this.#data];
	}

	public forEach(fn: (value: T) => void): void {
		this.#data.forEach(fn);
	}

	public length(): number {
		return this.#data.length;
	}

	public concat(set: Set<T>): Set<T> {
		return new Set([...this.#data, ...set.toArray()]);
	}

	public filter(fn: (value: T) => boolean): Set<T> {
		return new Set(this.#data.filter(fn));
	}

	public first(): T | undefined {
		return this.#data.slice(0)[0];
	}

	public last(): T | undefined {
		return this.#data.slice(-1)[0];
	}

	public copy(start: number, end: number): Set<T> {
		return new Set(this.#data.slice(start, end));
	}

	public equals(set: Set<T>): boolean {
		if (this.length() !== set.length()) {
			return false;
		}

		if (this === set) {
			return true;
		}

		for (const value of this) {
			if (!set.has(value)) {
				return false;
			}
		}

		return true;
	}

	public *[Symbol.iterator]() {
		for (const value of this.#data) {
			yield value;
		}
	}

	private isEqual(a: unknown, b: unknown): boolean {
		if (typeof a === typeof b) {
			return isEqual(a, b);
		}

		if (typeof a === 'number' && typeof b === 'string') {
			return a.toString() === b;
		}

		if (typeof a === 'string' && typeof b === 'number') {
			return a === b.toString();
		}

		return false;
	}
}
