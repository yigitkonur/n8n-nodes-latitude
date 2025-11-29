import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import type { Latitude } from '@latitude-data/sdk';
import type { ILatitudeCredentials } from './types';
import { sanitizeErrorMessage } from './utils';

/**
 * Creates and returns an authenticated Latitude SDK client
 * Uses dynamic import to avoid bundling issues
 */
export async function getLatitudeClient(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<Latitude> {
	const credentials = (await this.getCredentials('latitudeApi')) as ILatitudeCredentials;

	this.logger.debug('Initializing Latitude SDK client', {
		projectId: credentials.projectId,
	});

	try {
		// Dynamic import for SDK
		const { Latitude: LatitudeSDK } = await import('@latitude-data/sdk');

		const client = new LatitudeSDK(credentials.apiKey, {
			projectId: credentials.projectId,
		});

		this.logger.debug('Latitude SDK client created successfully');
		return client;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		const sanitizedError = sanitizeErrorMessage(errorMessage);

		this.logger.error('Failed to initialize Latitude SDK client', {
			error: sanitizedError,
		});

		throw new Error('Failed to connect to Latitude. Please verify your credentials.');
	}
}

/**
 * Gets Latitude credentials from the node context
 */
export async function getCredentials(
	context: ILoadOptionsFunctions,
): Promise<ILatitudeCredentials> {
	return (await context.getCredentials('latitudeApi')) as ILatitudeCredentials;
}
