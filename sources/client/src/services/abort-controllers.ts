import { ContextualAbortController } from './contextual-abort-controller';

/**
 * @internal
 */
class AbortControllers {
	private controllers = new Map<string, ContextualAbortController>();

	public has(controller: ContextualAbortController): boolean {
		return this.controllers.has(controller.context());
	}

	public add(
		controller: ContextualAbortController
	): ContextualAbortController {
		const context = controller.context();

		this.controller(context)?.abort();
		this.set(controller);

		return this.controller(context)!;
	}

	public delete(controller: ContextualAbortController): void {
		this.controllers.delete(controller.context());
	}

	private set(controller: ContextualAbortController): void {
		this.controllers.set(controller.context(), controller);
	}

	private controller(context: string): ContextualAbortController | undefined {
		return this.controllers.get(context);
	}
}

export const abortControllers = new AbortControllers();
