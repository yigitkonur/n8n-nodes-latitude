import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LatitudeApi implements ICredentialType {
	name = 'latitudeApi';

	displayName = 'Latitude API';

	documentationUrl = 'https://docs.latitude.so';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Latitude API key from the dashboard (Settings > API Keys)',
			placeholder: 'lat_...',
		},
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'number',
			default: 0,
			required: true,
			description: 'Your Latitude project ID (found in project settings)',
			placeholder: '12345',
		},
	];

	// Note: Credential testing happens in the node's loadOptions methods
	// when fetching prompts, which validates both API key and project ID
}
