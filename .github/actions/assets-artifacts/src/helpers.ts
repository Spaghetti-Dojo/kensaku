export function bailIfFalsy(value: boolean | string | number | unknown[], message: string): void {
	if ((Array.isArray(value) && value.length <= 0) || !value) {
		throw new Error(message || 'Unknown error')
	}
}
