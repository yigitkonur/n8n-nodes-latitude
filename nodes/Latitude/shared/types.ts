import type { INodeExecutionData } from 'n8n-workflow';

/**
 * Latitude API credentials structure
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
 * Simplified output format
 */
export interface ISimplifiedOutput {
	text?: string;
	object?: unknown;
	usage?: {
		inputTokens?: number;
		outputTokens?: number;
		totalTokens?: number;
	};
	uuid?: string;
}

/**
 * Prompt run result from Latitude SDK
 */
export interface IPromptRunResult {
	uuid?: string;
	conversation?: unknown[];
	response?: {
		text?: string;
		object?: unknown;
		usage?: unknown;
	};
}

/**
 * Return data with paired item for n8n
 */
export type LatitudeReturnData = INodeExecutionData[];
