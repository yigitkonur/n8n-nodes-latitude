import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { getLatitudeClient, extractPromptParameters } from './GenericFunctions';

export class Latitude implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Latitude',
		name: 'latitude',
		icon: 'file:latitude.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["promptPath"]}}',
		description: 'Execute AI prompts from Latitude.so with dynamic parameters',
		defaults: {
			name: 'Latitude',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'latitudeApi',
				required: true,
			},
		],
		properties: [
			// Prompt selection
			{
				displayName: 'Prompt Path',
				name: 'promptPath',
				type: 'options',
				required: true,
				typeOptions: {
					loadOptionsMethod: 'getPrompts',
				},
				default: '',
				placeholder: 'my-project/main-prompt',
				description: 'Choose from your Latitude prompts. Required parameters will load automatically.',
			},

			// Run Prompt - Parameters as dynamic collection
			{
				displayName: 'Parameters',
				name: 'parametersUi',
				placeholder: 'Add Parameter',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Map values to prompt variables (e.g., {{ query }}). Parameter names load from selected prompt.',
				options: [
					{
						name: 'parameter',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'options',
								required: true,
								typeOptions: {
									loadOptionsMethod: 'getPromptParameters',
									loadOptionsDependsOn: ['promptPath'],
								},
								default: '',
								description: 'Parameter name from prompt (auto-loads when prompt selected)',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								required: true,
								default: '',
								placeholder: 'Enter value or use expression {{$json.field}}',
								description: 'Value for this parameter. Supports n8n expressions.',
							},
						],
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getPrompts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = (await this.getCredentials('latitudeApi')) as {
					apiKey: string;
					projectId: number;
				};

				try {
					const { Latitude } = await import('@latitude-data/sdk');
					const client = new Latitude(credentials.apiKey, {
						projectId: credentials.projectId,
					});

					const prompts = await client.prompts.getAll();

					return prompts.map((prompt: any) => {
						const parameters = extractPromptParameters(prompt.content);
						return {
							name: prompt.path,
							value: prompt.path,
							description: parameters.length > 0 
								? `Required: ${parameters.map(p => `{{ ${p} }}`).join(', ')}`
								: 'No parameters required',
						};
					});
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Failed to load prompts';
					throw new Error(`Error loading prompts: ${errorMessage}`);
				}
			},

			async getPromptParameters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const promptPath = this.getCurrentNodeParameter('promptPath') as string;
				
				if (!promptPath) {
					return [];
				}

				const credentials = (await this.getCredentials('latitudeApi')) as {
					apiKey: string;
					projectId: number;
				};

				try {
					const { Latitude } = await import('@latitude-data/sdk');
					const client = new Latitude(credentials.apiKey, {
						projectId: credentials.projectId,
					});

					const prompt = await client.prompts.get(promptPath);
					const parameters = extractPromptParameters(prompt.content);

					if (parameters.length === 0) {
						return [{ 
							name: '(No Parameters Needed)',
							value: '',
							description: 'This prompt does not require parameters',
						}];
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
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		this.logger.info('Latitude node execution started', { itemCount: items.length });

		for (let i = 0; i < items.length; i++) {
			try {
				this.logger.debug('Processing item', { itemIndex: i });
				const client = await getLatitudeClient.call(this);
				this.logger.debug('Latitude SDK client initialized', { itemIndex: i });

				// Run prompt with parameters
				const promptPath = this.getNodeParameter('promptPath', i) as string;
				const parametersUi = this.getNodeParameter('parametersUi', i) as {
					parameter?: Array<{ name: string; value: string }>;
				};

				this.logger.info('Running prompt', { itemIndex: i, promptPath });

				// Convert fixedCollection format to object
				const parameters: Record<string, any> = {};
				if (parametersUi.parameter && Array.isArray(parametersUi.parameter)) {
					for (const param of parametersUi.parameter) {
						if (param.name && param.name !== '') {
							// Trim values to prevent whitespace issues
							parameters[param.name] = typeof param.value === 'string' ? param.value.trim() : param.value;
						}
					}
				}

				this.logger.debug('Parameters converted', { 
					itemIndex: i, 
					parameterCount: Object.keys(parameters).length,
					parameterNames: Object.keys(parameters)
				});
				this.logger.info('Executing prompt with Latitude SDK', { itemIndex: i, promptPath });
				
				const result = await client.prompts.run(promptPath, { parameters });
				
				this.logger.info('Prompt executed successfully', {
					itemIndex: i,
					promptPath,
					parameterCount: Object.keys(parameters).length,
					hasResponse: !!result,
				});

				returnData.push({
					json: {
						promptPath,
						parameters,
						result: result || {},
					},
					pairedItem: { item: i },
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				const errorStack = error instanceof Error ? error.stack : undefined;

				// Sanitize error message to prevent credential leakage
				const sanitizedError = errorMessage.replace(/api[-_]?key[s]?\s*[:=]\s*[a-z0-9_-]{10,}/gi, '[REDACTED]');

				this.logger.error('Latitude prompt execution failed', {
					itemIndex: i,
					error: sanitizedError,
					stack: errorStack,
				});

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: sanitizedError,
						},
						pairedItem: { item: i },
					});
					continue;
				}

				throw new NodeOperationError(
					this.getNode(), 
					new Error(sanitizedError),
					{ itemIndex: i }
				);
			}
		}

		this.logger.info('Latitude node execution completed', {
			processedItems: items.length,
			returnedItems: returnData.length,
		});

		return [returnData];
	}
}
