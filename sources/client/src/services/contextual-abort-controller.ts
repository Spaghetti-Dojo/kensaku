/**
 * @internal
 */
export class ContextualAbortController {
	#controller: AbortController;
	#context: string;
	#reason: string;

	constructor( context: string, reason: string ) {
		if ( context === '' ) {
			throw new Error( 'Abort Controllers, context cannot be empty' );
		}

		this.#controller = new AbortController();
		this.#context = context;
		this.#reason = reason;
	}

	public context(): string {
		return this.#context;
	}

	public abort(): ContextualAbortController {
		this.#controller.abort( this.reason() );
		return this;
	}

	public signal(): AbortSignal {
		return this.#controller.signal;
	}

	public isAborted(): boolean {
		return this.#controller.signal.aborted;
	}

	private reason(): DOMException {
		return new DOMException( this.#reason, 'AbortError' );
	}
}
