import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';

import { describe, expect, it } from '@jest/globals';

import { uniqueControlOptions } from '../../../../sources/js/src/utils/unique-control-options';

describe('Unique Control Options', () => {
	it('Do not allow same control options within the same set', () => {
		const set = OrderedSet<EntitiesSearch.ControlOption<string>>([
			{ label: 'foo', value: 'foo' },
			{ label: 'bar', value: 'bar' },
			{ label: 'foo', value: 'foo' },
			{ label: 'bar', value: 'bar' },
		]);

		expect(set.size).toBe(4);
		const uniqueSet = uniqueControlOptions(set);
		expect(uniqueSet.size).toBe(2);
		expect(uniqueSet.first()?.value).toBe('foo');
		expect(uniqueSet.last()?.value).toBe('bar');
	});
});
