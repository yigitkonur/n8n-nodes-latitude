import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { Latitude } from '@latitude-data/sdk';

export async function getLatitudeClient(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<Latitude> {
	const credentials = (await this.getCredentials('latitudeApi')) as {
		apiKey: string;
		projectId: number;
	};

	this.logger.debug('Initializing Latitude SDK client', {
		projectId: credentials.projectId,
	});

	try {
		const client = new Latitude(credentials.apiKey, {
			projectId: credentials.projectId,
		});

		this.logger.debug('Latitude SDK client created successfully');
		return client;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		// Sanitize error message to prevent credential leakage
		const sanitizedError = errorMessage.replace(/api[-_]?key[s]?\s*[:=]\s*[a-z0-9_-]{10,}/gi, '[REDACTED]');
		this.logger.error('Failed to initialize Latitude SDK client', { error: sanitizedError });
		throw new Error('Failed to connect to Latitude. Please verify your credentials.');
	}
}

export function extractPromptParameters(promptContent: string): string[] {
	const pattern = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/gi;
	const parameters = new Set<string>();
	
	for (const match of promptContent.matchAll(pattern)) {
		if (match[1]) parameters.add(match[1]);
	}
	
	return Array.from(parameters);
}
