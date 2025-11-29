import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { MessagesUi, LogResult } from '../shared';
import { getLatitudeClient, parseMessagesUi, extractLatitudeApiError } from '../shared';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const client = await getLatitudeClient.call(this);
			const promptPath = this.getNodeParameter('promptPath', i) as string;
			const messagesUi = this.getNodeParameter('messagesUi', i) as MessagesUi;
			const response = (this.getNodeParameter('response', i, '') as string).trim();

			const messages = parseMessagesUi(messagesUi);
			if (messages.length === 0) {
				throw new NodeOperationError(this.getNode(), 'At least one message is required', { itemIndex: i });
			}

			const sdkResult = await client.logs.create(
				promptPath,
				messages as unknown as never[],
				response ? { response } : {},
			);
			const result = sdkResult as unknown as LogResult;

			returnData.push({ json: result as unknown as IDataObject, pairedItem: { item: i } });
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
