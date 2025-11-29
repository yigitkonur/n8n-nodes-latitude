import type { INodeExecutionData } from 'n8n-workflow';

/**
 * Latitude API credentials structure
 * @see https://docs.latitude.so/guides/api/api-access
 */
export interface ILatitudeCredentials {
	apiKey: string;
	projectId: number;
}

/**
 * Parameters UI structure from fixedCollection
 */
export interface IParametersUi {
	parameter?: Array<{
		name: string;
		value: string;
	}>;
}

/**
 * SDK run options matching Latitude SDK interface
 * @see latitude.prompts.run() options
 */
export interface ILatitudeRunOptions {
	parameters?: Record<string, unknown>;
	stream?: boolean;
	customIdentifier?: string;
	versionUuid?: string;
}

/**
 * Token usage statistics from Latitude SDK
 * API uses promptTokens/completionTokens, SDK normalizes to inputTokens/outputTokens
 * @see https://docs.latitude.so/guides/api/api-access - Run a Document section
 */
export interface ITokenUsage {
	/** Tokens used in the prompt/input */
	promptTokens: number;
	/** Tokens generated in the completion/output */
	completionTokens: number;
	/** Total tokens used (promptTokens + completionTokens) */
	totalTokens: number;
}

/**
 * Tool call structure from Latitude SDK
 * Returned when prompt uses tools
 * @see https://docs.latitude.so/guides/prompt-manager/tools
 */
export interface IToolCall {
	/** Unique tool call ID */
	id: string;
	/** Name of the tool that was called */
	name: string;
	/** Arguments passed to the tool */
	arguments: Record<string, unknown>;
}

/**
 * Simplified output format for n8n users
 * Matches SDK response.* fields + uuid
 * @see https://docs.latitude.so/guides/api/api-access - Response format
 */
export interface ISimplifiedOutput {
	/** Conversation UUID for tracking and follow-up chats */
	uuid: string;
	/** AI-generated text response */
	text: string | null;
	/** Structured JSON output (if prompt has schema defined) */
	object: unknown | null;
	/** Token usage statistics */
	usage: ITokenUsage;
	/** Cost in USD for this run (if available) */
	cost?: number;
	/** Tool calls made during execution (if any) */
	toolCalls?: IToolCall[];
	/** Custom identifier if provided */
	customIdentifier?: string;
}

/**
 * Prompt run result from Latitude SDK
 * Matches the actual API response structure
 * @see https://docs.latitude.so/guides/api/api-access - Run a Document section
 */
export interface IPromptRunResult {
	/** Unique conversation UUID */
	uuid: string;
	/** Full conversation history (array of messages) */
	conversation: IConversationMessage[];
	/** Response details */
	response: {
		/** Response stream type: "text" for plain text, "object" for structured JSON */
		streamType?: 'text' | 'object';
		/** Text content of the response */
		text: string | null;
		/** Structured output for JSON prompts (when schema is defined) */
		object: unknown | null;
		/** Token usage statistics */
		usage: ITokenUsage;
		/** Cost in USD for this run */
		cost?: number;
		/** Tool calls made during execution */
		toolCalls?: IToolCall[];
	};
}

/**
 * Conversation message structure
 */
export interface IConversationMessage {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | unknown[];
}

/**
 * Latitude API Error structure
 * @see https://docs.latitude.so - Error Handling section
 */
export interface ILatitudeApiErrorDetails {
	message: string;
	errorCode?: string;
	status?: number;
}

/**
 * Return data with paired item for n8n
 */
export type LatitudeReturnData = INodeExecutionData[];
