import { Response } from '../classes/Response';
import { scanAllItems } from '../config/dynamoDB';
import { RESPONSE_MESSAGES, RESPONSE_STATUS, RESPONSE_SUCCES } from '../utils/response';

export const getProducts = async (tableName: string): Promise<Response> => {
	const response = new Response();
	try {
		const params = {
			TableName: tableName,
		};

		const allProducts = await scanAllItems(params);
		response.defineResponse({
			status: `${RESPONSE_STATUS.OK}`,
			message: RESPONSE_MESSAGES.OK,
			succes: RESPONSE_SUCCES.OK,
			data: allProducts,
		});
	} catch (error: unknown) {
		response.defineResponse({
			status: `${RESPONSE_STATUS.SERVER_ERROR}`,
			message: RESPONSE_MESSAGES.SERVER_ERROR,
			succes: RESPONSE_SUCCES.SERVER_ERROR,
			data: (error as Error).message,
		});
	} finally {
		return response;
	}
};
