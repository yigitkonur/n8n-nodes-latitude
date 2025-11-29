import type {
	ParametersUi,
	SimplifiedOutput,
	PromptRunResult,
	LatitudeApiErrorDetails,
	TokenUsage,
	ToolCall,
	MessagesUi,
	ConversationMessage,
} from './types';

/** Regex for extracting {{ variable }} placeholders from prompt content */
const PARAMETER_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/gi;

/** Regex for sanitizing API keys from error messages */
const API_KEY_PATTERN = /(?:lat_[a-z0-9]{20,}|api[-_]?key[s]?\s*[:=]\s*[a-z0-9_-]{10,})/gi;

/** Default token usage when not provided by SDK */
const DEFAULT_USAGE: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

/** Extracts parameter names from prompt content */
export function extractPromptParameters(promptContent: string): string[] {
	const parameters = new Set<string>();
	for (const match of promptContent.matchAll(PARAMETER_PATTERN)) {
		if (match[1]) parameters.add(match[1]);
	}
	return Array.from(parameters);
}

/** Converts fixedCollection UI format to key-value object */
export function parseParametersUi(parametersUi: ParametersUi): Record<string, unknown> {
	const parameters: Record<string, unknown> = {};
	if (!parametersUi.parameter?.length) return parameters;

	for (const param of parametersUi.parameter) {
		if (param.name) {
			parameters[param.name] = typeof param.value === 'string' ? param.value.trim() : param.value;
		}
	}
	return parameters;
}

/** Simplifies full SDK response to essential fields */
export function simplifyOutput(result: PromptRunResult, customIdentifier?: string): SimplifiedOutput {
	const { response } = result;
	const usage = response?.usage ?? DEFAULT_USAGE;

	const output: SimplifiedOutput = {
		uuid: result.uuid,
		text: response?.text ?? null,
		object: response?.object ?? null,
		usage: {
			promptTokens: usage.promptTokens ?? 0,
			completionTokens: usage.completionTokens ?? 0,
			totalTokens: usage.totalTokens ?? 0,
		},
	};

	if (response?.cost !== undefined) output.cost = response.cost;
	if (response?.toolCalls?.length) output.toolCalls = response.toolCalls as ToolCall[];
	if (customIdentifier) output.customIdentifier = customIdentifier;

	return output;
}

/** Sanitizes error messages to prevent credential leakage */
function sanitizeErrorMessage(message: string): string {
	return message.replace(API_KEY_PATTERN, '[REDACTED]');
}

/** Extracts structured error details from SDK error */
export function extractLatitudeApiError(error: unknown): LatitudeApiErrorDetails {
	if (error && typeof error === 'object') {
		const e = error as Record<string, unknown>;
		return {
			message: sanitizeErrorMessage(typeof e.message === 'string' ? e.message : 'Unknown error'),
			errorCode: typeof e.errorCode === 'string' ? e.errorCode : undefined,
			status: typeof e.status === 'number' ? e.status : undefined,
		};
	}
	if (error instanceof Error) return { message: sanitizeErrorMessage(error.message) };
	return { message: 'Unknown error occurred' };
}

/** Formats parameter list for display in dropdown descriptions */
export function formatParameterList(parameters: string[]): string {
	return parameters.length === 0
		? 'No parameters required'
		: `Required: ${parameters.map((p) => `{{ ${p} }}`).join(', ')}`;
}

/** Parses messages UI format to SDK-compatible message array */
export function parseMessagesUi(messagesUi: MessagesUi): ConversationMessage[] {
	if (!messagesUi.message?.length) return [];

	return messagesUi.message
		.filter((msg) => msg.content?.trim())
		.map((msg) => ({
			role: msg.role,
			content: [{ type: 'text' as const, text: msg.content.trim() }],
		}));
}
