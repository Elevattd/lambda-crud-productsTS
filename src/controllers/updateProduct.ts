import IProducts from '../interfaces/IProducts';
import { IParams } from '../interfaces/IParams';
import { Response } from '../classes/Response';
import { validateExistProduct } from '../validators/validateProduct';
import { getUpdateParams, updateItem } from '../config/dynamoDB';
import { GET_RESPONSE_MESSAGE, RESPONSE_MESSAGES, RESPONSE_STATUS, RESPONSE_SUCCES } from '../utils/response';

export const updateProduct = async (product: IProducts, tableName: string): Promise<Response> => {
	const response = new Response();
	try {
		const existProduct = await validateExistProduct(product, tableName);
		if (!existProduct) throw new Error(RESPONSE_MESSAGES.UPDATED);

		const productToUpdate: IProducts = {
			...existProduct,
			dateDelete: new Date().toISOString(),
			active: false,
		};

		const params: Partial<IParams> = getUpdateParams({
			values: productToUpdate,
			excludeKeys: ['ID', 'fechaCreacion', 'usuarioCreacion'],
			TableName: tableName,
		});

		const updatedProduct: IProducts = await updateItem(params);

		response.defineResponse({
			status: `${RESPONSE_STATUS.UPDATED}`,
			message: GET_RESPONSE_MESSAGE(RESPONSE_MESSAGES.UPDATED, updatedProduct.id),
			succes: RESPONSE_SUCCES.UPDATED,
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
