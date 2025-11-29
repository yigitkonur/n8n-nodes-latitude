import type { INodeProperties } from 'n8n-workflow';

const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'prompt',
	options: [
		{ name: 'Prompt', value: 'prompt', description: 'Run or chat with prompts' },
		{ name: 'Log', value: 'log', description: 'Create logs for external executions' },
	],
	description: 'The resource to operate on',
};

const promptOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['prompt'] } },
	default: 'run',
	options: [
		{ name: 'Run', value: 'run', description: 'Execute a prompt', action: 'Run a prompt' },
		{ name: 'Chat', value: 'chat', description: 'Continue a conversation', action: 'Chat with a prompt' },
	],
	description: 'The operation to perform',
};

const promptPathProperty: INodeProperties = {
	displayName: 'Prompt Path',
	name: 'promptPath',
	type: 'options',
	required: true,
	noDataExpression: true,
	displayOptions: { show: { resource: ['prompt'], operation: ['run'] } },
	typeOptions: { loadOptionsMethod: 'getPrompts' },
	default: '',
	placeholder: 'my-project/main-prompt',
	description: 'Choose from your Latitude prompts',
};

const conversationUuidProperty: INodeProperties = {
	displayName: 'Conversation UUID',
	name: 'conversationUuid',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['prompt'], operation: ['chat'] } },
	default: '',
	placeholder: 'abc123-def456-ghi789',
	description: 'UUID from a previous prompt run to continue the conversation',
};

const messageValuesDefinition = [
	{
		displayName: 'Role',
		name: 'role',
		type: 'options' as const,
		options: [
			{ name: 'User', value: 'user' },
			{ name: 'Assistant', value: 'assistant' },
			{ name: 'System', value: 'system' },
		],
		default: 'user',
		description: 'The role of the message sender',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string' as const,
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		placeholder: 'Enter your message...',
		description: 'The message content',
	},
];

const chatMessagesProperty: INodeProperties = {
	displayName: 'Messages',
	name: 'messagesUi',
	placeholder: 'Add Message',
	type: 'fixedCollection',
	required: true,
	displayOptions: { show: { resource: ['prompt'], operation: ['chat'] } },
	typeOptions: { multipleValues: true },
	default: {},
	description: 'Messages to send in the conversation',
	options: [{ name: 'message', displayName: 'Message', values: messageValuesDefinition }],
};

const parametersProperty: INodeProperties = {
	displayName: 'Parameters',
	name: 'parametersUi',
	placeholder: 'Add Parameter',
	type: 'fixedCollection',
	displayOptions: { show: { resource: ['prompt'], operation: ['run'] } },
	typeOptions: { multipleValues: true },
	default: {},
	description: 'Map values to prompt variables (e.g., {{ query }})',
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
					typeOptions: { loadOptionsMethod: 'getPromptParameters', loadOptionsDependsOn: ['promptPath'] },
					default: '',
					description: 'Parameter name from prompt',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					required: true,
					default: '',
					placeholder: 'Enter value or {{$json.field}}',
					description: 'Value for this parameter',
				},
			],
		},
	],
};

const simplifyProperty: INodeProperties = {
	displayName: 'Simplify Output',
	name: 'simplify',
	type: 'boolean',
	displayOptions: { show: { resource: ['prompt'] } },
	default: true,
	description: 'Whether to return only response data or full conversation history',
};

const promptOptionsProperty: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	displayOptions: { show: { resource: ['prompt'], operation: ['run'] } },
	default: {},
	options: [
		{
			displayName: 'Custom Identifier',
			name: 'customIdentifier',
			type: 'string',
			default: '',
			placeholder: 'order-123',
			description: 'Tag this run for filtering in the Latitude dashboard',
		},
		{
			displayName: 'Version UUID',
			name: 'versionUuid',
			type: 'string',
			default: '',
			placeholder: 'abc123-def456',
			description: 'Use a specific project version instead of live',
		},
	],
};

const logOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['log'] } },
	default: 'create',
	options: [{ name: 'Create', value: 'create', description: 'Create a log entry', action: 'Create a log' }],
	description: 'The operation to perform',
};

const logPromptPathProperty: INodeProperties = {
	displayName: 'Prompt Path',
	name: 'promptPath',
	type: 'options',
	required: true,
	noDataExpression: true,
	displayOptions: { show: { resource: ['log'], operation: ['create'] } },
	typeOptions: { loadOptionsMethod: 'getPrompts' },
	default: '',
	placeholder: 'my-project/main-prompt',
	description: 'The prompt to associate this log with',
};

const logMessagesProperty: INodeProperties = {
	displayName: 'Messages',
	name: 'messagesUi',
	placeholder: 'Add Message',
	type: 'fixedCollection',
	required: true,
	displayOptions: { show: { resource: ['log'], operation: ['create'] } },
	typeOptions: { multipleValues: true },
	default: {},
	description: 'The conversation messages to log',
	options: [{ name: 'message', displayName: 'Message', values: messageValuesDefinition }],
};

const logResponseProperty: INodeProperties = {
	displayName: 'Response',
	name: 'response',
	type: 'string',
	typeOptions: { rows: 4 },
	displayOptions: { show: { resource: ['log'], operation: ['create'] } },
	default: '',
	placeholder: 'The AI-generated response...',
	description: 'The response text from the AI model (optional)',
};

export const latitudeProperties: INodeProperties[] = [
	resourceProperty,
	promptOperationProperty,
	promptPathProperty,
	parametersProperty,
	conversationUuidProperty,
	chatMessagesProperty,
	simplifyProperty,
	promptOptionsProperty,
	logOperationProperty,
	logPromptPathProperty,
	logMessagesProperty,
	logResponseProperty,
];
