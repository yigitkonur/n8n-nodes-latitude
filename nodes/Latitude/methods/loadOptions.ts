import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import {
	getCredentials,
	extractPromptParameters,
	formatParameterList,
} from '../shared';

/**
 * Fetches all prompts from the Latitude project for dropdown selection
 */
export async function getPrompts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = await getCredentials(this);

	try {
		const { Latitude } = await import('@latitude-data/sdk');
		const client = new Latitude(credentials.apiKey, {
			projectId: credentials.projectId,
		});

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
		const errorMessage = error instanceof Error ? error.message : 'Failed to load prompts';
		throw new Error(`Error loading prompts: ${errorMessage}`);
	}
}

/**
 * Fetches parameters for a specific prompt
 * Depends on promptPath selection
 */
export async function getPromptParameters(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const promptPath = this.getCurrentNodeParameter('promptPath') as string;

	if (!promptPath) {
		return [];
	}

	const credentials = await getCredentials(this);

	try {
		const { Latitude } = await import('@latitude-data/sdk');
		const client = new Latitude(credentials.apiKey, {
			projectId: credentials.projectId,
		});

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
		const errorMessage = error instanceof Error ? error.message : 'Failed to load parameters';
		throw new Error(`Error loading prompt parameters: ${errorMessage}`);
	}
}
