import IProducts from '../interfaces/IProducts';
import { IParams } from '../interfaces/IParams';
import { Response } from '../classes/Response';
import { v4 as uuid } from 'uuid';
import { insertItem } from '../config/dynamoDB';
import { validateExistProduct } from '../validators/validateProduct';
import { RESPONSE_STATUS, RESPONSE_MESSAGES, RESPONSE_SUCCES, GET_RESPONSE_MESSAGE } from '../utils/response';

export const createProduct = async (product: IProducts, tableName: string): Promise<Response> => {
	const response: Response = new Response();
	try {
		const productExist = await validateExistProduct(product, tableName);
		if (productExist) throw new Error(RESPONSE_MESSAGES.ERROR_CREATED);

		const newProduct: IProducts = {
			id: uuid(),
			active: false,
			unitsSold: 0,
			dateCreation: new Date().toISOString(),
			...product,
		};

		const params: Partial<IParams> = {
			TableName: tableName,
			Item: newProduct,
		};

		const createProduct: IProducts = await insertItem(params);

		response.defineResponse({
			status: `${RESPONSE_STATUS.CREATED}`,
			message: GET_RESPONSE_MESSAGE(RESPONSE_MESSAGES.CREATED, newProduct.id),
			succes: RESPONSE_SUCCES.CREATED,
			data: createProduct,
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
