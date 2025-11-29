import type { INodeProperties } from 'n8n-workflow';

// ============================================================================
// Resource Selection
// ============================================================================

/**
 * Resource selection dropdown
 * @see https://docs.latitude.so/guides/sdk/typescript
 */
export const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'prompt',
	options: [
		{
			name: 'Prompt',
			value: 'prompt',
			description: 'Run or chat with prompts from your Latitude project',
		},
		{
			name: 'Log',
			value: 'log',
			description: 'Create logs for external prompt executions',
		},
	],
	description: 'The resource to operate on',
};

// ============================================================================
// Prompt Resource Operations
// ============================================================================

/**
 * Operations for the Prompt resource
 */
export const promptOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['prompt'],
		},
	},
	default: 'run',
	options: [
		{
			name: 'Run',
			value: 'run',
			description: 'Execute a prompt with parameters',
			action: 'Run a prompt',
		},
		{
			name: 'Chat',
			value: 'chat',
			description: 'Continue a conversation using a conversation UUID',
			action: 'Chat with a prompt',
		},
	],
	description: 'The operation to perform',
};

/**
 * Prompt path selection property with dynamic loading
 * @see https://docs.latitude.so/guides/sdk/typescript#get-a-prompt
 */
export const promptPathProperty: INodeProperties = {
	displayName: 'Prompt Path',
	name: 'promptPath',
	type: 'options',
	required: true,
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['prompt'],
			operation: ['run'],
		},
	},
	typeOptions: {
		loadOptionsMethod: 'getPrompts',
	},
	default: '',
	placeholder: 'my-project/main-prompt',
	description: 'Choose from your Latitude prompts. Required parameters will load automatically.',
};

/**
 * Conversation UUID for chat operation
 * @see https://docs.latitude.so/guides/sdk/typescript#chat-with-a-prompt
 */
export const conversationUuidProperty: INodeProperties = {
	displayName: 'Conversation UUID',
	name: 'conversationUuid',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['prompt'],
			operation: ['chat'],
		},
	},
	default: '',
	placeholder: 'abc123-def456-ghi789',
	description:
		'The conversation UUID from a previous prompt run. Use to continue an existing conversation.',
};

/**
 * Messages for chat operation
 * @see https://docs.latitude.so/promptl/syntax/messages
 */
export const chatMessagesProperty: INodeProperties = {
	displayName: 'Messages',
	name: 'messagesUi',
	placeholder: 'Add Message',
	type: 'fixedCollection',
	required: true,
	displayOptions: {
		show: {
			resource: ['prompt'],
			operation: ['chat'],
		},
	},
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	description: 'Messages to send in the conversation',
	options: [
		{
			name: 'message',
			displayName: 'Message',
			values: [
				{
					displayName: 'Role',
					name: 'role',
					type: 'options',
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
					type: 'string',
					typeOptions: {
						rows: 3,
					},
					required: true,
					default: '',
					placeholder: 'Enter your message...',
					description: 'The message content',
				},
			],
		},
	],
};

/**
 * Dynamic parameters collection property
 * Maps to SDK's parameters option in prompts.run()
 * @see https://docs.latitude.so/guides/sdk/typescript#running-prompts
 */
export const parametersProperty: INodeProperties = {
	displayName: 'Parameters',
	name: 'parametersUi',
	placeholder: 'Add Parameter',
	type: 'fixedCollection',
	displayOptions: {
		show: {
			resource: ['prompt'],
			operation: ['run'],
		},
	},
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
	displayOptions: {
		show: {
			resource: ['prompt'],
		},
	},
	default: true,
	description:
		'Whether to return only the response data (true) or full conversation history (false)',
};

/**
 * Additional options collection for prompt operations
 * @see https://docs.latitude.so/guides/sdk/typescript#running-prompts
 */
export const promptOptionsProperty: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	displayOptions: {
		show: {
			resource: ['prompt'],
			operation: ['run'],
		},
	},
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

// ============================================================================
// Log Resource Operations
// ============================================================================

/**
 * Operations for the Log resource
 */
export const logOperationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['log'],
		},
	},
	default: 'create',
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a log entry for external prompt execution',
			action: 'Create a log',
		},
	],
	description: 'The operation to perform',
};

/**
 * Prompt path for log creation
 */
export const logPromptPathProperty: INodeProperties = {
	displayName: 'Prompt Path',
	name: 'promptPath',
	type: 'options',
	required: true,
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['log'],
			operation: ['create'],
		},
	},
	typeOptions: {
		loadOptionsMethod: 'getPrompts',
	},
	default: '',
	placeholder: 'my-project/main-prompt',
	description: 'The prompt to associate this log with',
};

/**
 * Messages for log creation
 * @see https://docs.latitude.so/guides/sdk/typescript#creating-logs
 */
export const logMessagesProperty: INodeProperties = {
	displayName: 'Messages',
	name: 'messagesUi',
	placeholder: 'Add Message',
	type: 'fixedCollection',
	required: true,
	displayOptions: {
		show: {
			resource: ['log'],
			operation: ['create'],
		},
	},
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	description: 'The conversation messages to log',
	options: [
		{
			name: 'message',
			displayName: 'Message',
			values: [
				{
					displayName: 'Role',
					name: 'role',
					type: 'options',
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
					type: 'string',
					typeOptions: {
						rows: 3,
					},
					required: true,
					default: '',
					placeholder: 'Enter the message content...',
					description: 'The message content',
				},
			],
		},
	],
};

/**
 * Response text for log creation
 */
export const logResponseProperty: INodeProperties = {
	displayName: 'Response',
	name: 'response',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	displayOptions: {
		show: {
			resource: ['log'],
			operation: ['create'],
		},
	},
	default: '',
	placeholder: 'The AI-generated response text...',
	description: 'The response text from the AI model (optional)',
};

// ============================================================================
// Combined Properties Export
// ============================================================================

/**
 * All properties for the Latitude node in display order
 */
export const latitudeProperties: INodeProperties[] = [
	// Resource selection
	resourceProperty,
	// Prompt operations
	promptOperationProperty,
	promptPathProperty,
	parametersProperty,
	conversationUuidProperty,
	chatMessagesProperty,
	simplifyProperty,
	promptOptionsProperty,
	// Log operations
	logOperationProperty,
	logPromptPathProperty,
	logMessagesProperty,
	logResponseProperty,
];
