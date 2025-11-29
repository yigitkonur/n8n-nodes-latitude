import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class LatitudeApi implements ICredentialType {
	name = 'latitudeApi';

	displayName = 'Latitude API';

	documentationUrl = 'https://docs.latitude.so';

	icon: Icon = 'file:icons/latitude.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Latitude API key from the dashboard (Settings > API Keys).',
			placeholder: 'lat_...',
		},
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'number',
			default: 0,
			required: true,
			description: 'Your Latitude project ID (found in project settings).',
			placeholder: '12345',
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
			baseURL: 'https://gateway.latitude.so/api/v2',
			url: '=/projects/{{$credentials.projectId}}/versions/live/documents',
			method: 'GET',
		},
	};
}
