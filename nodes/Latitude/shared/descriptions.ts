import type { INodeProperties } from 'n8n-workflow';

/**
 * Prompt path selection property with dynamic loading
 * @see https://docs.latitude.so - Prompt Management
 */
export const promptPathProperty: INodeProperties = {
	displayName: 'Prompt Path',
	name: 'promptPath',
	type: 'options',
	required: true,
	noDataExpression: true,
	typeOptions: {
		loadOptionsMethod: 'getPrompts',
	},
	default: '',
	placeholder: 'my-project/main-prompt',
	description: 'Choose from your Latitude prompts. Required parameters will load automatically.',
};

/**
 * Dynamic parameters collection property
 * Maps to SDK's parameters option in prompts.run()
 */
export const parametersProperty: INodeProperties = {
	displayName: 'Parameters',
	name: 'parametersUi',
	placeholder: 'Add Parameter',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	description:
		'Map values to prompt variables (e.g., {{ query }}). Parameter names load from the selected prompt.',
	options: [
		{
			name: 'parameter',
			displayName: 'Parameter',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'options',
					required: true,
					typeOptions: {
						loadOptionsMethod: 'getPromptParameters',
						loadOptionsDependsOn: ['promptPath'],
					},
					default: '',
					description: 'Parameter name from prompt (auto-loads when prompt selected)',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					required: true,
					default: '',
					placeholder: 'Enter value or use expression {{$json.field}}',
					description: 'Value for this parameter. Supports n8n expressions.',
				},
			],
		},
	],
};

/**
 * Simplify output toggle property
 */
export const simplifyProperty: INodeProperties = {
	displayName: 'Simplify Output',
	name: 'simplify',
	type: 'boolean',
	default: true,
	description: 'Whether to return only the response data (true) or full conversation history (false)',
};

/**
 * Additional options collection for advanced SDK features
 * @see https://docs.latitude.so - Running Prompts section
 */
export const additionalOptionsProperty: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	options: [
		{
			displayName: 'Custom Identifier',
			name: 'customIdentifier',
			type: 'string',
			default: '',
			placeholder: 'e.g., order-123, user-456',
			description:
				'Tag this run with a custom identifier for filtering and analysis in the Latitude dashboard',
		},
		{
			displayName: 'Version UUID',
			name: 'versionUuid',
			type: 'string',
			default: '',
			placeholder: 'e.g., abc123-def456',
			description:
				'Use a specific project version instead of live. Leave empty to use the live version.',
		},
	],
};

/**
 * All properties for the Latitude node
 */
export const latitudeProperties: INodeProperties[] = [
	promptPathProperty,
	parametersProperty,
	simplifyProperty,
	additionalOptionsProperty,
];
