import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { latitudeProperties } from './shared';
import { loadOptions } from './methods';
import { runPrompt } from './actions';

/**
 * Latitude Node
 *
 * Execute AI prompts from Latitude.so with dynamic parameters.
 * Supports automatic parameter detection from prompt content.
 *
 * @see https://docs.latitude.so
 */
export class Latitude implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Latitude',
		name: 'latitude',
		icon: 'file:latitude.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["promptPath"]}}',
		description: 'Execute AI prompts from Latitude.so with dynamic parameters.',
		defaults: {
			name: 'Latitude',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'latitudeApi',
				required: true,
			},
		],
		properties: latitudeProperties,
	};

	methods = { loadOptions };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return runPrompt.call(this);
	}
}
