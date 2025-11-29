import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import type { Latitude } from '@latitude-data/sdk';
import type { LatitudeCredentials } from './types';
import { sanitizeErrorMessage } from './utils';

/**
 * Creates and returns an authenticated Latitude SDK client
 * Uses dynamic import to avoid bundling issues
 * Supports custom gateway URL for self-hosted instances
 * @see https://docs.latitude.so/guides/sdk/typescript#initialization
 */
export async function getLatitudeClient(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<Latitude> {
	const credentials = (await this.getCredentials('latitudeApi')) as LatitudeCredentials;

	this.logger.debug('Initializing Latitude SDK client', {
		projectId: credentials.projectId,
		hasCustomGateway: !!credentials.gatewayUrl,
	});

	try {
		// Dynamic import for SDK
		const { Latitude: LatitudeSDK } = await import('@latitude-data/sdk');

		// Build SDK options
		const sdkOptions: {
			projectId: number;
			versionUuid?: string;
			__internal?: { gateway?: { host: string; port: number; ssl: boolean } };
		} = {
			projectId: credentials.projectId,
			versionUuid: 'live', // Default to live version
		};

		// Configure custom gateway if provided (for self-hosted instances)
		if (credentials.gatewayUrl) {
			try {
				const gatewayUrl = new URL(credentials.gatewayUrl);
				sdkOptions.__internal = {
					gateway: {
						host: gatewayUrl.hostname,
						port: parseInt(gatewayUrl.port, 10) || (gatewayUrl.protocol === 'https:' ? 443 : 80),
						ssl: gatewayUrl.protocol === 'https:',
					},
				};
			} catch {
				this.logger.warn('Invalid gateway URL provided, using default', {
					providedUrl: credentials.gatewayUrl,
				});
			}
		}

		const client = new LatitudeSDK(credentials.apiKey, sdkOptions);

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
): Promise<LatitudeCredentials> {
	return (await context.getCredentials('latitudeApi')) as LatitudeCredentials;
}
