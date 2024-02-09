import { describe, expect, it } from '@jest/globals';

import { Set } from '../../../../sources/client/src/vo/set';

describe('Set', () => {
	it('Should be empty when created', () => {
		const set = new Set<number>();
		expect(set.length()).toBe(0);
	});

	it('Should add elements', () => {
		const set = new Set<number>();
		expect(set.add(1).add(2).add(3).length()).toBe(3);
	});

	it('Should remove elements', () => {
		const set = new Set<number>();
		expect(set.add(1).add(2).add(3).delete(2).length()).toBe(2);
		expect(set.delete(1).delete(3).length()).toBe(0);
	});

	it('Should check element existence', () => {
		const set = new Set<number>();
		const newSet = set.add(1).add(2).add(3);
		expect(newSet.has(2)).toBe(true);
		expect(newSet.has(4)).toBe(false);
	});

	it('Should return the concat of two sets', () => {
		const set = new Set<number>();
		const set1 = set.add(1).add(2).add(3);
		const set2 = set.add(2).add(3).add(4);
		const concat = set1.concat(set2);
		expect(concat.length()).toBe(6);
		expect(concat.has(1)).toBe(true);
		expect(concat.has(2)).toBe(true);
		expect(concat.has(3)).toBe(true);
		expect(concat.has(4)).toBe(true);
	});

	it('Should not add the same object again', () => {
		const obj = { a: 1 };
		const set = new Set<any>();
		expect(set.add(obj).add(obj).length()).toBe(1);
	});

	it('Should not add the same object again if it is a different reference', () => {
		const obj = { a: 1 };
		const obj2 = { a: 1 };
		const set = new Set<any>();
		expect(set.add(obj).add(obj2).length()).toBe(1);
	});

	it.each([
		[[1, 2, 3, 4, 5], 3, true],
		[[1, 2, 3, 4, 5], '4', true],
		[['3', '4', '5'], 4, true],
		[[{ a: 1 }, { b: 2 }, { c: 3 }], { b: 2 }, true],
		[[{ a: 1 }, { b: 2 }, { c: 3 }], 'b', false],
	])(
		'Should return true if a given value is the same in shape of an existing one',
		(collection, given, expected) => {
			const set = new Set<any>(collection);
			expect(set.has(given)).toBe(expected);
		}
	);

	it('Return the first element', () => {
		const set = new Set<number>();
		expect(set.add(4).add(2).add(3).first()).toBe(4);
	});

	it('Return the last element', () => {
		const set = new Set<number>();
		expect(set.add(4).add(2).add(3).last()).toBe(3);
	});

	it('Should copy the set', () => {
		const set = new Set<number>();
		const newSet = set.add(1).add(2).add(3).add(4).add(5);
		const sliced = newSet.copy(1, 3);
		expect(sliced.length()).toBe(2);
		expect(sliced !== newSet);
	});

	it('Map a ControlOption to a string', () => {
		const set = new Set<{ label: string; value: number }>([
			{ value: 1, label: 'First' },
			{ value: 11232, label: 'Second' },
			{ value: 34543543, label: 'Third' },
			{ value: 56234231, label: 'Fourth' },
		]);
		const mapped = set.map((option) => option.value);
		expect(mapped.length()).toBe(4);
		expect(mapped.has(1)).toBe(true);
		expect(mapped.has(11232)).toBe(true);
		expect(mapped.has(34543543)).toBe(true);
		expect(mapped.has(56234231)).toBe(true);
	});

	it('Filters out non valid elements', () => {
		const set = new Set<string | number>(['a', 1, 'b', 2, 'c', 3]);
		const filtered = set.filter((element) => typeof element === 'string');
		expect(filtered.length()).toBe(3);
		expect(filtered.has(1)).toBe(false);
		expect(filtered.has(2)).toBe(false);
		expect(filtered.has(3)).toBe(false);
	});

	it('Should walk through the set', () => {
		const set = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		const walked: Array<number> = [];
		set.forEach((element) => walked.push(element));
		expect(walked.length).toBe(5);
	});

	it('Should iterate over the elements', () => {
		const set = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		const iterated = [];
		for (const element of set) {
			iterated.push(element);
		}
		expect(iterated.length).toBe(5);
	});

	it('Should ensure that two sets are equal in shape and content', () => {
		const set = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		const set2 = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		expect(set.equals(set2)).toBe(true);
	});

	it('Should ensure that two sets are equal if they are the same reference', () => {
		const set = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		expect(set.equals(set)).toBe(true);
	});

	it('Should ensure two sets are not equals if they have different length', () => {
		const set = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		const set2 = new Set<number>().add(1).add(2).add(3).add(4);
		expect(set.equals(set2)).toBe(false);
	});

	it('Should ensure two sets are not equals if they have different content', () => {
		const set = new Set<number>().add(1).add(2).add(3).add(4).add(5);
		const set2 = new Set<number>().add(1).add(2).add(3).add(4).add(6);
		expect(set.equals(set2)).toBe(false);
	});
});
