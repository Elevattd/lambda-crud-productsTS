import { Response } from '../classes/Response';
import { validateExistProduct } from '../validators/validateProduct';
import { GET_RESPONSE_MESSAGE, RESPONSE_MESSAGES, RESPONSE_STATUS, RESPONSE_SUCCES } from '../utils/response';

export const getProductId = async (productId: string, tableName: string): Promise<Response> => {
	const response = new Response();
	try {
		const existProduct = await validateExistProduct(productId, tableName);
		if (!existProduct) throw new Error(RESPONSE_MESSAGES.NO_CONTENT);

		response.defineResponse({
			status: `${RESPONSE_STATUS.PARTIAL_CONTENT}`,
			message: GET_RESPONSE_MESSAGE(RESPONSE_MESSAGES.PARTIAL_CONTENT, productId),
			succes: RESPONSE_SUCCES.PARTIAL_CONTENT,
			data: existProduct,
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
