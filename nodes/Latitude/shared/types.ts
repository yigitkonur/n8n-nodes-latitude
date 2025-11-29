/** Latitude API credentials */
export type LatitudeCredentials = {
	apiKey: string;
	projectId: number;
	gatewayUrl?: string;
};

/** Parameters UI structure from fixedCollection */
export type ParametersUi = {
	parameter?: Array<{ name: string; value: string }>;
};

/** Messages UI structure from fixedCollection */
export type MessagesUi = {
	message?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
};

/** SDK run options */
export type LatitudeRunOptions = {
	parameters?: Record<string, unknown>;
	stream?: boolean;
	customIdentifier?: string;
	versionUuid?: string;
};

/** Token usage statistics */
export type TokenUsage = {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
};

/** Tool call structure */
export type ToolCall = {
	id: string;
	name: string;
	arguments: Record<string, unknown>;
};

/** Simplified output for n8n users */
export type SimplifiedOutput = {
	uuid: string;
	text: string | null;
	object: unknown | null;
	usage: TokenUsage;
	cost?: number;
	toolCalls?: ToolCall[];
	customIdentifier?: string;
};

/** Message content for PromptL format */
export type MessageContent = { type: 'text'; text: string };

/** Conversation message */
export type ConversationMessage = {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | MessageContent[];
};

/** Prompt run result from SDK */
export type PromptRunResult = {
	uuid: string;
	conversation: ConversationMessage[];
	response: {
		streamType?: 'text' | 'object';
		text: string | null;
		object: unknown | null;
		usage: TokenUsage;
		cost?: number;
		toolCalls?: ToolCall[];
	};
};

/** Log creation result */
export type LogResult = {
	id: string;
	uuid: string;
	documentUuid: string;
	commitId: string;
	resolvedContent: string;
	contentHash: string;
	parameters: Record<string, unknown>;
	customIdentifier?: string;
	duration?: string;
	source: string;
	createdAt: string;
	updatedAt: string;
};

/** Latitude API error details */
export type LatitudeApiErrorDetails = {
	message: string;
	errorCode?: string;
	status?: number;
};
