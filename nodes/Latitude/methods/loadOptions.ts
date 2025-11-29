import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { getLatitudeClient, extractPromptParameters, formatParameterList, extractLatitudeApiError } from '../shared';

export async function getPrompts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const client = await getLatitudeClient.call(this);
		const prompts = await client.prompts.getAll();

		return prompts.map((prompt: { path: string; content: string }) => ({
			name: prompt.path,
			value: prompt.path,
			description: formatParameterList(extractPromptParameters(prompt.content)),
		}));
	} catch (error) {
		throw new Error(`Error loading prompts: ${extractLatitudeApiError(error).message}`);
	}
}

export async function getPromptParameters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const promptPath = this.getCurrentNodeParameter('promptPath') as string;
	if (!promptPath) return [];

	try {
		const client = await getLatitudeClient.call(this);
		const prompt = await client.prompts.get(promptPath);
		const parameters = extractPromptParameters(prompt.content);

		if (parameters.length === 0) {
			return [{ name: '(No Parameters Needed)', value: '', description: 'This prompt does not require parameters' }];
		}

		return parameters.map((param) => ({ name: param, value: param, description: `{{ ${param} }}` }));
	} catch (error) {
		throw new Error(`Error loading parameters: ${extractLatitudeApiError(error).message}`);
	}
}
