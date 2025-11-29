import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IParametersUi, IPromptRunResult } from '../shared';
import {
	getLatitudeClient,
	parseParametersUi,
	simplifyOutput,
	sanitizeErrorMessage,
} from '../shared';

/**
 * Executes a prompt run operation for a single item
 */
async function executePromptRun(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const client = await getLatitudeClient.call(context);

	// Get node parameters
	const promptPath = context.getNodeParameter('promptPath', itemIndex) as string;
	const parametersUi = context.getNodeParameter('parametersUi', itemIndex) as IParametersUi;
	const simplify = context.getNodeParameter('simplify', itemIndex, true) as boolean;

	// Parse parameters from UI format
	const parameters = parseParametersUi(parametersUi);

	context.logger.info('Running prompt', {
		itemIndex,
		promptPath,
		parameterCount: Object.keys(parameters).length,
	});

	// Execute the prompt (stream: false for n8n compatibility)
	const result = (await client.prompts.run(promptPath, {
		parameters,
		stream: false,
	})) as IPromptRunResult;

	context.logger.info('Prompt executed successfully', {
		itemIndex,
		promptPath,
		hasResponse: !!result,
	});

	// Format output based on simplify option
	const outputData = simplify ? simplifyOutput(result) : result;

	return {
		json: outputData as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

/**
 * Handles errors during prompt execution
 */
function handleExecutionError(
	context: IExecuteFunctions,
	error: unknown,
	itemIndex: number,
): INodeExecutionData | never {
	const errorMessage = error instanceof Error ? error.message : 'Unknown error';
	const errorStack = error instanceof Error ? error.stack : undefined;
	const sanitizedError = sanitizeErrorMessage(errorMessage);

	context.logger.error('Latitude prompt execution failed', {
		itemIndex,
		error: sanitizedError,
		stack: errorStack,
	});

	if (context.continueOnFail()) {
		return {
			json: { error: sanitizedError },
			pairedItem: { item: itemIndex },
		};
	}

	throw new NodeOperationError(context.getNode(), new Error(sanitizedError), {
		itemIndex,
	});
}

/**
 * Main execute function for the Run Prompt operation
 * Processes all input items and returns results
 */
export async function execute(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	this.logger.info('Latitude node execution started', {
		itemCount: items.length,
	});

	for (let i = 0; i < items.length; i++) {
		try {
			this.logger.debug('Processing item', { itemIndex: i });

			const result = await executePromptRun(this, i);
			returnData.push(result);
		} catch (error) {
			const errorResult = handleExecutionError(this, error, i);

			// If continueOnFail returned a result, push it
			if (errorResult) {
				returnData.push(errorResult);
			}
		}
	}

	this.logger.info('Latitude node execution completed', {
		processedItems: items.length,
		returnedItems: returnData.length,
	});

	return [returnData];
}
