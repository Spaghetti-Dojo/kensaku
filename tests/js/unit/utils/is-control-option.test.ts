import { describe, it, expect } from '@jest/globals';

import { isControlOption } from '../../../../sources/js/src/utils/is-control-option';

describe('Is Control Option', () => {
	it('is valid control option', () => {
		const value = {
			label: 'label',
			value: 'value',
		};

		expect(isControlOption(value)).toEqual(true);
	});

	describe.each([[null], [undefined], [''], [0], [false]])('', (value) => {
		it('is not control option because of invalid given value', () => {
			expect(isControlOption(value)).toEqual(false);
		});
	});

	it('is not control option because of missing `value` property', () => {
		const value = {
			label: 'label',
		};

		expect(isControlOption(value)).toEqual(false);
	});

	it('is not control option because of missing `label` property', () => {
		const value = {
			value: 'value',
		};

		expect(isControlOption(value)).toEqual(false);
	});

	it('control option can have any type of value', () => {
		const value = {
			label: 'label',
			value: 0,
		};

		expect(isControlOption(value)).toEqual(true);
	});

	it('is not control option because invalid type of `label`', () => {
		const value = {
			label: 0,
			value: 'value',
		};

		expect(isControlOption(value)).toEqual(false);
	});

	it('is not control option because more than 2 properties exists', () => {
		const value = {
			label: 'label',
			value: 'value',
			other: 'other',
		};

		expect(isControlOption(value)).toEqual(false);
	});

	it('is not control option because missing both properties `value` and `label`', () => {
		const value = {
			other: 'other',
			another: 'another',
		};

		expect(isControlOption(value)).toEqual(false);
	});
});
