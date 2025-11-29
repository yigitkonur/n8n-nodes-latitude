import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

/**
 * Latitude API credentials for n8n
 * Supports both cloud and self-hosted Latitude instances
 * @see https://docs.latitude.so/guides/api/api-access
 */
export class LatitudeApi implements ICredentialType {
	name = 'latitudeApi';

	displayName = 'Latitude API';

	documentationUrl = 'https://docs.latitude.so/guides/api/api-access';

	icon: Icon = {
		light: 'file:icons/latitude.svg',
		dark: 'file:icons/latitude.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Latitude API key from the dashboard (Settings > API Keys). Keys start with "lat_".',
			placeholder: 'lat_...',
		},
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'number',
			default: 0,
			required: true,
			description:
				'Your Latitude project ID (found in project settings or URL: app.latitude.so/projects/{id})',
			placeholder: '12345',
		},
		{
			displayName: 'Gateway URL',
			name: 'gatewayUrl',
			type: 'string',
			default: '',
			required: false,
			description:
				'Custom gateway URL for self-hosted Latitude instances. Leave empty for cloud (gateway.latitude.so).',
			placeholder: 'https://your-latitude-instance.com',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.gatewayUrl || "https://gateway.latitude.so"}}/api/v2',
			url: '=/projects/{{$credentials.projectId}}/versions/live/documents',
			method: 'GET',
		},
	};
}
