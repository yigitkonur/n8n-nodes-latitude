import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { MessagesUi, LogResult } from '../shared';
import { getLatitudeClient, parseMessagesUi, extractLatitudeApiError } from '../shared';

/**
 * Executes a log creation operation for a single item
 * Uses Latitude SDK's logs.create() method to push logs
 * @see https://docs.latitude.so/guides/sdk/typescript#creating-logs
 */
async function executeCreateLogOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const client = await getLatitudeClient.call(context);

	// Get node parameters
	const promptPath = context.getNodeParameter('promptPath', itemIndex) as string;
	const messagesUi = context.getNodeParameter('messagesUi', itemIndex) as MessagesUi;
	const response = context.getNodeParameter('response', itemIndex, '') as string;

	// Parse messages from UI format to SDK format
	const messages = parseMessagesUi(messagesUi);

	if (messages.length === 0) {
		throw new NodeOperationError(context.getNode(), 'At least one message is required', {
			itemIndex,
		});
	}

	context.logger.info('Creating Latitude log', {
		itemIndex,
		promptPath,
		messageCount: messages.length,
		hasResponse: !!response,
	});

	// Build options for log creation
	const logOptions: { response?: string } = {};
	if (response && response.trim() !== '') {
		logOptions.response = response.trim();
	}

	// Execute the log creation using SDK's logs.create()
	// Messages are cast since SDK expects specific PromptL Message type
	// @see https://docs.latitude.so/guides/sdk/typescript#creating-logs
	const sdkResult = await client.logs.create(
		promptPath,
		messages as unknown as never[],
		logOptions,
	);

	// Cast SDK result to our interface
	const result = sdkResult as unknown as LogResult;

	context.logger.info('Latitude log created successfully', {
		itemIndex,
		promptPath,
		uuid: result.uuid,
	});

	return {
		json: result as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

/**
 * Handles errors during log creation
 */
function handleCreateLogError(
	context: IExecuteFunctions,
	error: unknown,
	itemIndex: number,
): INodeExecutionData | never {
	const errorDetails = extractLatitudeApiError(error);
	const errorStack = error instanceof Error ? error.stack : undefined;

	context.logger.error('Latitude log creation failed', {
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
		description: errorDetails.errorCode ? `Error code: ${errorDetails.errorCode}` : undefined,
	});
}

/**
 * Main execute function for the Create Log operation
 * Processes all input items and returns results
 * @see https://docs.latitude.so/guides/sdk/typescript#creating-logs
 */
export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	this.logger.info('Latitude create log operation started', {
		itemCount: items.length,
	});

	for (let i = 0; i < items.length; i++) {
		try {
			this.logger.debug('Processing create log item', { itemIndex: i });

			const result = await executeCreateLogOperation(this, i);
			returnData.push(result);
		} catch (error) {
			const errorResult = handleCreateLogError(this, error, i);

			// If continueOnFail returned a result, push it
			if (errorResult) {
				returnData.push(errorResult);
			}
		}
	}

	this.logger.info('Latitude create log operation completed', {
		processedItems: items.length,
		returnedItems: returnData.length,
	});

	return [returnData];
}
