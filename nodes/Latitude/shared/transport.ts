import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import type { Latitude } from '@latitude-data/sdk';
import type { LatitudeCredentials } from './types';

/** Creates authenticated Latitude SDK client with optional custom gateway */
export async function getLatitudeClient(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<Latitude> {
	const credentials = (await this.getCredentials('latitudeApi')) as LatitudeCredentials;

	try {
		const { Latitude: LatitudeSDK } = await import('@latitude-data/sdk');

		const sdkOptions: {
			projectId: number;
			versionUuid?: string;
			__internal?: { gateway?: { host: string; port: number; ssl: boolean } };
		} = {
			projectId: credentials.projectId,
			versionUuid: 'live',
		};

		// Custom gateway for self-hosted instances
		if (credentials.gatewayUrl) {
			try {
				const url = new URL(credentials.gatewayUrl);
				sdkOptions.__internal = {
					gateway: {
						host: url.hostname,
						port: parseInt(url.port, 10) || (url.protocol === 'https:' ? 443 : 80),
						ssl: url.protocol === 'https:',
					},
				};
			} catch {
				// Invalid URL, use default gateway
			}
		}

		return new LatitudeSDK(credentials.apiKey, sdkOptions);
	} catch {
		throw new Error('Failed to connect to Latitude. Please verify your credentials.');
	}
}
