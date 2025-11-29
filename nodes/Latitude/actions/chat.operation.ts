import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { MessagesUi, PromptRunResult } from '../shared';
import {
	getLatitudeClient,
	parseMessagesUi,
	simplifyOutput,
	extractLatitudeApiError,
} from '../shared';

/**
 * Executes a chat operation for a single item
 * Uses Latitude SDK's prompts.chat() method to continue a conversation
 * @see https://docs.latitude.so/guides/sdk/typescript#chat-with-a-prompt
 */
async function executeChatOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const client = await getLatitudeClient.call(context);

	// Get node parameters
	const conversationUuid = context.getNodeParameter('conversationUuid', itemIndex) as string;
	const messagesUi = context.getNodeParameter('messagesUi', itemIndex) as MessagesUi;
	const simplify = context.getNodeParameter('simplify', itemIndex, true) as boolean;

	// Parse messages from UI format to SDK format
	const messages = parseMessagesUi(messagesUi);

	if (messages.length === 0) {
		throw new NodeOperationError(context.getNode(), 'At least one message is required', {
			itemIndex,
		});
	}

	context.logger.info('Continuing Latitude conversation', {
		itemIndex,
		conversationUuid,
		messageCount: messages.length,
	});

	// Execute the chat using SDK's prompts.chat()
	// Messages are cast to any since SDK expects specific PromptL Message type
	// @see https://docs.latitude.so/guides/sdk/typescript#chat-with-a-prompt
	const sdkResult = await client.prompts.chat(conversationUuid, messages as unknown as never[], {
		stream: false, // n8n doesn't support streaming responses
	});

	// Cast SDK result to our interface
	const result = sdkResult as unknown as PromptRunResult;

	context.logger.info('Latitude chat completed successfully', {
		itemIndex,
		conversationUuid,
		uuid: result.uuid,
		hasResponse: !!result.response,
	});

	// Format output based on simplify option
	const outputData = simplify ? simplifyOutput(result) : result;

	return {
		json: outputData as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

/**
 * Handles errors during chat execution
 */
function handleChatError(
	context: IExecuteFunctions,
	error: unknown,
	itemIndex: number,
): INodeExecutionData | never {
	const errorDetails = extractLatitudeApiError(error);
	const errorStack = error instanceof Error ? error.stack : undefined;

	context.logger.error('Latitude chat failed', {
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
 * Main execute function for the Chat operation
 * Processes all input items and returns results
 * @see https://docs.latitude.so/guides/sdk/typescript#chat-with-a-prompt
 */
export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	this.logger.info('Latitude chat operation started', {
		itemCount: items.length,
	});

	for (let i = 0; i < items.length; i++) {
		try {
			this.logger.debug('Processing chat item', { itemIndex: i });

			const result = await executeChatOperation(this, i);
			returnData.push(result);
		} catch (error) {
			const errorResult = handleChatError(this, error, i);

			// If continueOnFail returned a result, push it
			if (errorResult) {
				returnData.push(errorResult);
			}
		}
	}

	this.logger.info('Latitude chat operation completed', {
		processedItems: items.length,
		returnedItems: returnData.length,
	});

	return [returnData];
}
