import { describe, it, expect } from '@jest/globals';

import { ControlOption } from '../../../../sources/client/src/vo/control-option';

describe('ControlOption', () => {
	it('should create a new ControlOption', () => {
		const controlOption = ControlOption.new('label', 'value');
		expect(controlOption.label).toBe('label');
		expect(controlOption.value).toBe('value');
	});

	it('should throw an error when creating a new ControlOption with an empty label', () => {
		expect(() => ControlOption.new('', 'value')).toThrow(
			'ControlOption: Label must be a non empty string.'
		);
	});

	it('should throw an error when creating a new ControlOption with an empty value', () => {
		expect(() => ControlOption.new('label', '')).toThrow(
			'ControlOption: Value must be a non empty string.'
		);
	});
});
