import IProducts from '../interfaces/IProducts';
import { IParams } from '../interfaces/IParams';
import { Response } from '../classes/Response';
import { validateExistProduct } from '../validators/validateProduct';
import { getUpdateParams, updateItem } from '../config/dynamoDB';
import { GET_RESPONSE_MESSAGE, RESPONSE_MESSAGES, RESPONSE_STATUS, RESPONSE_SUCCES } from '../utils/response';

export const deleteProduct = async (productId: string, tableName: string): Promise<Response> => {
	const response = new Response();
	try {
		const existProduct = await validateExistProduct(productId, tableName);
		if (!existProduct) throw new Error(RESPONSE_MESSAGES.DELETED);

		const updateProduct: Partial<IProducts> = {
			...existProduct,
			dateUpdate: new Date().toISOString(),
		};

		const params: Partial<IParams> = getUpdateParams({
			values: updateProduct,
			excludeKeys: ['ID', 'fechaCreacion', 'usuarioCreacion'],
			TableName: tableName,
		});

		const updatedProduct: Partial<IProducts> = await updateItem(params);

		response.defineResponse({
			status: `${RESPONSE_STATUS.DELETED}`,
			message: GET_RESPONSE_MESSAGE(RESPONSE_MESSAGES.DELETED, updatedProduct.id),
			succes: RESPONSE_SUCCES.DELETED,
			data: updatedProduct,
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
