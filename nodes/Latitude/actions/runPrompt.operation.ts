import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { ParametersUi, PromptRunResult, LatitudeRunOptions } from '../shared';
import { getLatitudeClient, parseParametersUi, simplifyOutput, extractLatitudeApiError } from '../shared';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const client = await getLatitudeClient.call(this);
			const promptPath = this.getNodeParameter('promptPath', i) as string;
			const parametersUi = this.getNodeParameter('parametersUi', i) as ParametersUi;
			const simplify = this.getNodeParameter('simplify', i, true) as boolean;
			const options = this.getNodeParameter('options', i, {}) as {
				customIdentifier?: string;
				versionUuid?: string;
			};

			const runOptions: LatitudeRunOptions = {
				parameters: parseParametersUi(parametersUi),
				stream: false,
				...(options.customIdentifier && { customIdentifier: options.customIdentifier }),
				...(options.versionUuid && { versionUuid: options.versionUuid }),
			};

			const sdkResult = await client.prompts.run(promptPath, runOptions);
			const result = sdkResult as unknown as PromptRunResult;
			const outputData = simplify ? simplifyOutput(result, options.customIdentifier) : result;

			returnData.push({ json: outputData as unknown as IDataObject, pairedItem: { item: i } });
		} catch (error) {
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
