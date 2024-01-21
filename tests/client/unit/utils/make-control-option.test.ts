import { describe, expect, it } from '@jest/globals';

import { makeControlOption } from '../../../../sources/client/src/utils/make-control-option';

describe('makeControlOption', () => {
	it('shall return a readonly object of Control Option Type', () => {
		const controlOption = makeControlOption('label', 'value');

		expect(Object.isFrozen(controlOption)).toEqual(true);
		expect(controlOption.label).toEqual('label');
		expect(controlOption.value).toEqual('value');
	});
});
