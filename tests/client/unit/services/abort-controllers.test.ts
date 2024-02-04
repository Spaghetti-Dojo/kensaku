import { it, jest, describe, expect, beforeEach } from '@jest/globals';

import { abortControllers } from '../../../../sources/client/src/services/abort-controllers';
import { ContextualAbortController } from '../../../../sources/client/src/services/contextual-abort-controller';

describe('AbortControllers', () => {
	let controller: ContextualAbortController;

	beforeEach(() => {
		controller = new ContextualAbortController('context', 'reason');
	});

	it('should add a controller', () => {
		abortControllers.add(controller);
		expect(abortControllers.has(controller)).toBe(true);
	});

	it('should delete a controller', () => {
		abortControllers.add(controller);
		expect(abortControllers.has(controller)).toBe(true);

		abortControllers.delete(controller);
		expect(abortControllers.has(controller)).toBe(false);
	});

	it('should abort a controller', () => {
		const spy = jest.spyOn(controller, 'abort');
		abortControllers.add(controller);
		abortControllers.add(controller);
		expect(spy).toHaveBeenCalled();
	});
});
