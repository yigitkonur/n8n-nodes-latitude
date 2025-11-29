import type {
	IParametersUi,
	ISimplifiedOutput,
	IPromptRunResult,
	ILatitudeApiErrorDetails,
	ITokenUsage,
	IToolCall,
} from './types';

/**
 * Regex pattern for extracting {{ variable }} placeholders from prompt content
 * Matches PromptL syntax: {{ variable_name }}
 * @see https://docs.latitude.so/promptl/syntax
 */
const PARAMETER_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/gi;

/**
 * Regex pattern for sanitizing API keys from error messages
 * Matches common API key formats (lat_xxx, api_key=xxx, etc.)
 */
const API_KEY_PATTERN = /(?:lat_[a-z0-9]{20,}|api[-_]?key[s]?\s*[:=]\s*[a-z0-9_-]{10,})/gi;

/**
 * Extracts parameter names from prompt content
 * Finds all {{ variable }} patterns and returns unique parameter names
 * @param promptContent - The raw prompt content string
 * @returns Array of unique parameter names found
 */
export function extractPromptParameters(promptContent: string): string[] {
	const parameters = new Set<string>();

	for (const match of promptContent.matchAll(PARAMETER_PATTERN)) {
		if (match[1]) {
			parameters.add(match[1]);
		}
	}

	return Array.from(parameters);
}

/**
 * Converts fixedCollection UI format to simple key-value object
 * Trims string values to prevent whitespace issues
 * @param parametersUi - The UI parameters from n8n fixedCollection
 * @returns Record of parameter name to value
 */
export function parseParametersUi(parametersUi: IParametersUi): Record<string, unknown> {
	const parameters: Record<string, unknown> = {};

	if (!parametersUi.parameter || !Array.isArray(parametersUi.parameter)) {
		return parameters;
	}

	for (const param of parametersUi.parameter) {
		if (param.name && param.name !== '') {
			parameters[param.name] =
				typeof param.value === 'string' ? param.value.trim() : param.value;
		}
	}

	return parameters;
}

/**
 * Default token usage when not provided by SDK
 * Uses API field names: promptTokens, completionTokens, totalTokens
 */
const DEFAULT_USAGE: ITokenUsage = {
	promptTokens: 0,
	completionTokens: 0,
	totalTokens: 0,
};

/**
 * Simplifies the full Latitude response to essential fields only
 * Matches SDK response structure: uuid, response.text, response.object, response.usage, response.cost
 * @param result - Full SDK response
 * @param customIdentifier - Optional custom identifier used in the request
 * @returns Simplified output for n8n users
 * @see https://docs.latitude.so/guides/api/api-access - Run a Document section
 */
export function simplifyOutput(
	result: IPromptRunResult,
	customIdentifier?: string,
): ISimplifiedOutput {
	const response = result.response;
	const usage = (response?.usage as ITokenUsage) ?? DEFAULT_USAGE;

	const output: ISimplifiedOutput = {
		uuid: result.uuid,
		text: response?.text ?? null,
		object: response?.object ?? null,
		usage: {
			promptTokens: usage.promptTokens ?? 0,
			completionTokens: usage.completionTokens ?? 0,
			totalTokens: usage.totalTokens ?? 0,
		},
	};

	// Include cost if available (billing info)
	if (response?.cost !== undefined) {
		output.cost = response.cost;
	}

	// Include tool calls if any were made
	if (response?.toolCalls && response.toolCalls.length > 0) {
		output.toolCalls = response.toolCalls as IToolCall[];
	}

	// Include customIdentifier if it was provided
	if (customIdentifier) {
		output.customIdentifier = customIdentifier;
	}

	return output;
}

/**
 * Sanitizes error messages to prevent credential leakage
 * Replaces any API key patterns with [REDACTED]
 * @param message - Error message that may contain sensitive data
 * @returns Sanitized message safe for logging
 */
export function sanitizeErrorMessage(message: string): string {
	return message.replace(API_KEY_PATTERN, '[REDACTED]');
}

/**
 * Extracts error details from a Latitude API error
 * The SDK throws LatitudeApiError with errorCode and status properties
 * @param error - Error caught from SDK call
 * @returns Structured error details
 * @see https://docs.latitude.so - Error Handling section
 */
export function extractLatitudeApiError(error: unknown): ILatitudeApiErrorDetails {
	// Check if it's a LatitudeApiError (has errorCode and status)
	if (error && typeof error === 'object') {
		const apiError = error as Record<string, unknown>;

		return {
			message: sanitizeErrorMessage(
				typeof apiError.message === 'string' ? apiError.message : 'Unknown Latitude API error',
			),
			errorCode: typeof apiError.errorCode === 'string' ? apiError.errorCode : undefined,
			status: typeof apiError.status === 'number' ? apiError.status : undefined,
		};
	}

	// Standard Error fallback
	if (error instanceof Error) {
		return {
			message: sanitizeErrorMessage(error.message),
		};
	}

	return {
		message: 'Unknown error occurred',
	};
}

/**
 * Formats parameter list for display in dropdown descriptions
 * @param parameters - Array of parameter names
 * @returns Formatted string for UI display
 */
export function formatParameterList(parameters: string[]): string {
	if (parameters.length === 0) {
		return 'No parameters required';
	}

	return `Required: ${parameters.map((p) => `{{ ${p} }}`).join(', ')}`;
}
