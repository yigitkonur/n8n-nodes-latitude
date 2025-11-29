import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IParametersUi, IPromptRunResult, ILatitudeRunOptions } from '../shared';
import {
	getLatitudeClient,
	parseParametersUi,
	simplifyOutput,
	extractLatitudeApiError,
} from '../shared';

/**
 * Gets the SDK run options from node parameters
 * @see https://docs.latitude.so - Running Prompts section
 */
function getRunOptions(
	context: IExecuteFunctions,
	itemIndex: number,
	parameters: Record<string, unknown>,
): ILatitudeRunOptions {
	// Get additional options
	const options = context.getNodeParameter('options', itemIndex, {}) as {
		customIdentifier?: string;
		versionUuid?: string;
	};

	const runOptions: ILatitudeRunOptions = {
		parameters,
		stream: false, // n8n doesn't support streaming responses
	};

	// Add customIdentifier if provided (for run tracking in Latitude dashboard)
	if (options.customIdentifier) {
		runOptions.customIdentifier = options.customIdentifier;
	}

	// Add versionUuid if provided (to use specific project version)
	if (options.versionUuid) {
		runOptions.versionUuid = options.versionUuid;
	}

	return runOptions;
}

/**
 * Executes a prompt run operation for a single item
 * Uses Latitude SDK's prompts.run() method with all supported options
 * @see https://docs.latitude.so - Running Prompts section
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

	// Build SDK run options
	const runOptions = getRunOptions(context, itemIndex, parameters);

	context.logger.info('Running Latitude prompt', {
		itemIndex,
		promptPath,
		parameterCount: Object.keys(parameters).length,
		hasCustomIdentifier: !!runOptions.customIdentifier,
		hasVersionUuid: !!runOptions.versionUuid,
	});

	// Execute the prompt using SDK's prompts.run()
	// @see https://docs.latitude.so - Running Prompts section
	const sdkResult = await client.prompts.run(promptPath, runOptions);

	// Cast SDK result to our interface (SDK returns GenerationResponse)
	const result = sdkResult as unknown as IPromptRunResult;

	context.logger.info('Latitude prompt executed successfully', {
		itemIndex,
		promptPath,
		uuid: result.uuid,
		hasResponse: !!result.response,
	});

	// Format output based on simplify option
	const outputData = simplify
		? simplifyOutput(result, runOptions.customIdentifier)
		: result;

	return {
		json: outputData as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

/**
 * Handles errors during prompt execution
 * Extracts LatitudeApiError details when available
 * @see https://docs.latitude.so - Error Handling section
 */
function handleExecutionError(
	context: IExecuteFunctions,
	error: unknown,
	itemIndex: number,
): INodeExecutionData | never {
	// Extract structured error details (handles LatitudeApiError)
	const errorDetails = extractLatitudeApiError(error);
	const errorStack = error instanceof Error ? error.stack : undefined;

	context.logger.error('Latitude prompt execution failed', {
		itemIndex,
		error: errorDetails.message,
		errorCode: errorDetails.errorCode,
		status: errorDetails.status,
		stack: errorStack,
	});

	if (context.continueOnFail()) {
		return {
			json: {
				error: errorDetails.message,
				errorCode: errorDetails.errorCode,
				status: errorDetails.status,
			},
			pairedItem: { item: itemIndex },
		};
	}

	throw new NodeOperationError(context.getNode(), new Error(errorDetails.message), {
		itemIndex,
		description: errorDetails.errorCode
			? `Error code: ${errorDetails.errorCode}`
			: undefined,
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
