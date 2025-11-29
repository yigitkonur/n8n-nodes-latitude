import type { INodeExecutionData } from 'n8n-workflow';

/**
 * Latitude API credentials structure
 * @see https://docs.latitude.so/guides/api/api-access
 */
export type LatitudeCredentials = {
	apiKey: string;
	projectId: number;
	gatewayUrl?: string;
};

/**
 * Parameters UI structure from fixedCollection
 */
export type ParametersUi = {
	parameter?: Array<{
		name: string;
		value: string;
	}>;
};

/**
 * Messages UI structure from fixedCollection for chat/log operations
 * @see https://docs.latitude.so/promptl/syntax/messages
 */
export type MessagesUi = {
	message?: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}>;
};

/**
 * SDK run options matching Latitude SDK interface
 * @see https://docs.latitude.so/guides/sdk/typescript#running-prompts
 */
export type LatitudeRunOptions = {
	parameters?: Record<string, unknown>;
	stream?: boolean;
	customIdentifier?: string;
	versionUuid?: string;
};

/**
 * SDK chat options matching Latitude SDK interface
 * @see https://docs.latitude.so/guides/sdk/typescript#chat-with-a-prompt
 */
export type LatitudeChatOptions = {
	stream?: boolean;
};

/**
 * SDK log options matching Latitude SDK interface
 * @see https://docs.latitude.so/guides/sdk/typescript#creating-logs
 */
export type LatitudeLogOptions = {
	response?: string;
	projectId?: number;
	versionUuid?: string;
};

/**
 * Token usage statistics from Latitude SDK
 * @see https://docs.latitude.so/guides/api/api-access - Run a Document section
 */
export type TokenUsage = {
	/** Tokens used in the prompt/input */
	promptTokens: number;
	/** Tokens generated in the completion/output */
	completionTokens: number;
	/** Total tokens used (promptTokens + completionTokens) */
	totalTokens: number;
};

/**
 * Tool call structure from Latitude SDK
 * Returned when prompt uses tools
 * @see https://docs.latitude.so/guides/prompt-manager/tools
 */
export type ToolCall = {
	/** Unique tool call ID */
	id: string;
	/** Name of the tool that was called */
	name: string;
	/** Arguments passed to the tool */
	arguments: Record<string, unknown>;
};

/**
 * Simplified output format for n8n users
 * Matches SDK response.* fields + uuid
 * @see https://docs.latitude.so/guides/api/api-access - Response format
 */
export type SimplifiedOutput = {
	/** Conversation UUID for tracking and follow-up chats */
	uuid: string;
	/** AI-generated text response */
	text: string | null;
	/** Structured JSON output (if prompt has schema defined) */
	object: unknown | null;
	/** Token usage statistics */
	usage: TokenUsage;
	/** Cost in USD for this run (if available) */
	cost?: number;
	/** Tool calls made during execution (if any) */
	toolCalls?: ToolCall[];
	/** Custom identifier if provided */
	customIdentifier?: string;
};

/**
 * Prompt run result from Latitude SDK
 * Matches the actual API response structure
 * @see https://docs.latitude.so/guides/api/api-access - Run a Document section
 */
export type PromptRunResult = {
	/** Unique conversation UUID */
	uuid: string;
	/** Full conversation history (array of messages) */
	conversation: ConversationMessage[];
	/** Response details */
	response: {
		/** Response stream type: "text" for plain text, "object" for structured JSON */
		streamType?: 'text' | 'object';
		/** Text content of the response */
		text: string | null;
		/** Structured output for JSON prompts (when schema is defined) */
		object: unknown | null;
		/** Token usage statistics */
		usage: TokenUsage;
		/** Cost in USD for this run */
		cost?: number;
		/** Tool calls made during execution */
		toolCalls?: ToolCall[];
	};
};

/**
 * Chat result from Latitude SDK (same structure as run result)
 * @see https://docs.latitude.so/guides/sdk/typescript#chat-with-a-prompt
 */
export type ChatResult = PromptRunResult;

/**
 * Log creation result from Latitude SDK
 * @see https://docs.latitude.so/guides/sdk/typescript#creating-logs
 */
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

/**
 * Message content structure for PromptL format
 * @see https://docs.latitude.so/promptl/syntax/messages
 */
export type MessageContent = {
	type: 'text';
	text: string;
};

/**
 * Conversation message structure
 * @see https://docs.latitude.so/promptl/syntax/messages
 */
export type ConversationMessage = {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | MessageContent[];
};

/**
 * Latitude API Error structure
 * @see https://docs.latitude.so/guides/sdk/typescript#error-handling
 */
export type LatitudeApiErrorDetails = {
	message: string;
	errorCode?: string;
	status?: number;
};

/**
 * Return data with paired item for n8n
 */
export type LatitudeReturnData = INodeExecutionData[];

/**
 * Available resources in the Latitude node
 */
export type LatitudeResource = 'prompt' | 'log';

/**
 * Available operations for the prompt resource
 */
export type PromptOperation = 'run' | 'chat';

/**
 * Available operations for the log resource
 */
export type LogOperation = 'create';
