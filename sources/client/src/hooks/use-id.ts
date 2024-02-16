import React from 'react';

export function useId(maybeId?: string): string {
	const fallbackId = React.useId();
	return maybeId ?? fallbackId;
}
