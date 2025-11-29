import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import {
	getLatitudeClient,
	extractPromptParameters,
	formatParameterList,
	extractLatitudeApiError,
} from '../shared';

/**
 * Fetches all prompts from the Latitude project for dropdown selection
 * Uses SDK's prompts.getAll() method
 * @see https://docs.latitude.so - Get All Prompts section
 */
export async function getPrompts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const client = await getLatitudeClient.call(this);

		// SDK method: client.prompts.getAll()
		const prompts = await client.prompts.getAll();

		return prompts.map((prompt: { path: string; content: string }) => {
			const parameters = extractPromptParameters(prompt.content);

			return {
				name: prompt.path,
				value: prompt.path,
				description: formatParameterList(parameters),
			};
		});
	} catch (error) {
		const errorDetails = extractLatitudeApiError(error);
		throw new Error(`Error loading prompts: ${errorDetails.message}`);
	}
}

/**
 * Fetches parameters for a specific prompt
 * Uses SDK's prompts.get() method to retrieve prompt content
 * Depends on promptPath selection
 * @see https://docs.latitude.so - Get a Prompt section
 */
export async function getPromptParameters(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const promptPath = this.getCurrentNodeParameter('promptPath') as string;

	if (!promptPath) {
		return [];
	}

	try {
		const client = await getLatitudeClient.call(this);

		// SDK method: client.prompts.get(path)
		const prompt = await client.prompts.get(promptPath);
		const parameters = extractPromptParameters(prompt.content);

		if (parameters.length === 0) {
			return [
				{
					name: '(No Parameters Needed)',
					value: '',
					description: 'This prompt does not require parameters',
				},
			];
		}

		return parameters.map((param: string) => ({
			name: param,
			value: param,
			description: `Parameter: {{ ${param} }}`,
		}));
	} catch (error) {
		const errorDetails = extractLatitudeApiError(error);
		throw new Error(`Error loading prompt parameters: ${errorDetails.message}`);
	}
}
