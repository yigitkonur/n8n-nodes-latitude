import type { IParametersUi, ISimplifiedOutput, IPromptRunResult } from './types';

/**
 * Regex pattern for extracting {{ variable }} placeholders from prompt content
 */
const PARAMETER_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/gi;

/**
 * Regex pattern for sanitizing API keys from error messages
 */
const API_KEY_PATTERN = /api[-_]?key[s]?\s*[:=]\s*[a-z0-9_-]{10,}/gi;

/**
 * Extracts parameter names from prompt content
 * Finds all {{ variable }} patterns and returns unique parameter names
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
 */
export function parseParametersUi(parametersUi: IParametersUi): Record<string, unknown> {
	const parameters: Record<string, unknown> = {};

	if (!parametersUi.parameter || !Array.isArray(parametersUi.parameter)) {
		return parameters;
	}

	for (const param of parametersUi.parameter) {
		if (param.name && param.name !== '') {
			parameters[param.name] = typeof param.value === 'string' 
				? param.value.trim() 
				: param.value;
		}
	}

	return parameters;
}

/**
 * Simplifies the full Latitude response to essential fields only
 */
export function simplifyOutput(result: IPromptRunResult): ISimplifiedOutput {
	const response = result.response;

	return {
		text: response?.text,
		object: response?.object,
		usage: response?.usage as ISimplifiedOutput['usage'],
		uuid: result.uuid,
	};
}

/**
 * Sanitizes error messages to prevent credential leakage
 * Replaces any API key patterns with [REDACTED]
 */
export function sanitizeErrorMessage(message: string): string {
	return message.replace(API_KEY_PATTERN, '[REDACTED]');
}

/**
 * Formats parameter list for display in dropdown descriptions
 */
export function formatParameterList(parameters: string[]): string {
	if (parameters.length === 0) {
		return 'No parameters required';
	}

	return `Required: ${parameters.map((p) => `{{ ${p} }}`).join(', ')}`;
}
