import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { MessagesUi, PromptRunResult } from '../shared';
import { getLatitudeClient, parseMessagesUi, simplifyOutput, extractLatitudeApiError } from '../shared';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const client = await getLatitudeClient.call(this);
			const conversationUuid = this.getNodeParameter('conversationUuid', i) as string;
			const messagesUi = this.getNodeParameter('messagesUi', i) as MessagesUi;
			const simplify = this.getNodeParameter('simplify', i, true) as boolean;

			const messages = parseMessagesUi(messagesUi);
			if (messages.length === 0) {
				throw new NodeOperationError(this.getNode(), 'At least one message is required', { itemIndex: i });
			}

			const sdkResult = await client.prompts.chat(conversationUuid, messages as unknown as never[], {
				stream: false,
			});
			const result = sdkResult as unknown as PromptRunResult;
			const outputData = simplify ? simplifyOutput(result) : result;

			returnData.push({ json: outputData as unknown as IDataObject, pairedItem: { item: i } });
		} catch (error) {
			if (error instanceof NodeOperationError) throw error;

			const { message, errorCode, status } = extractLatitudeApiError(error);

			if (this.continueOnFail()) {
				returnData.push({ json: { error: message, errorCode, status }, pairedItem: { item: i } });
				continue;
			}

			throw new NodeOperationError(this.getNode(), message, {
				itemIndex: i,
				description: errorCode ? `Error code: ${errorCode}` : undefined,
			});
		}
	}

	return [returnData];
}
