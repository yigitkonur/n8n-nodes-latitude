import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { latitudeProperties } from './shared';
import { loadOptions } from './methods';
import { runPrompt, chat, createLog } from './actions';

/**
 * Latitude Node
 *
 * Execute AI prompts and manage logs with the Latitude.so platform.
 * Supports running prompts, continuing conversations, and creating logs.
 *
 * @see https://docs.latitude.so/guides/sdk/typescript
 */
export class Latitude implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Latitude',
		name: 'latitude',
		icon: { light: 'file:latitude.svg', dark: 'file:latitude.svg' },
		group: ['transform'],
		version: 1,
		subtitle:
			'={{$parameter["resource"] === "prompt" ? ($parameter["operation"] === "run" ? $parameter["promptPath"] : "Chat: " + $parameter["conversationUuid"]) : "Log: " + $parameter["promptPath"]}}',
		description:
			'Execute AI prompts and manage logs with the Latitude.so platform. Run prompts, chat, and create logs.',
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
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		this.logger.info('Latitude node executing', { resource, operation });

		// Dispatch to appropriate operation handler
		if (resource === 'prompt') {
			if (operation === 'run') {
				return runPrompt.call(this);
			}
			if (operation === 'chat') {
				return chat.call(this);
			}
		}

		if (resource === 'log') {
			if (operation === 'create') {
				return createLog.call(this);
			}
		}

		// Should never reach here if UI is configured correctly
		throw new NodeOperationError(
			this.getNode(),
			`Unknown resource "${resource}" or operation "${operation}"`,
		);
	}
}
