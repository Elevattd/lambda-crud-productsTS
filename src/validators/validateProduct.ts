import IProducts from '../interfaces/IProducts';
import { scanAllItems } from '../config/dynamoDB';

type ProductIdentifier = string | { name: string; idProvider: string };

export const validateExistProduct = async (
	productIdentifier: ProductIdentifier,
	tableName: string,
): Promise<IProducts | null> => {
	try {
		let filterExpression = '';
		let expressionAttributeValues: Record<string, string> = {};

		if (typeof productIdentifier === 'string') {
			filterExpression = 'id = :id';
			expressionAttributeValues = {
				':id': productIdentifier,
			};
		} else {
			filterExpression = 'name = :name AND idProvider = :idProvider';
			expressionAttributeValues = {
				':name': productIdentifier.name,
				':idProvider': productIdentifier.idProvider,
			};
		}

		const [productExist] = await scanAllItems({
			TableName: tableName,
			FilterExpression: filterExpression,
			ExpressionAttributeValues: expressionAttributeValues,
		});

		return productExist ?? null;
	} catch (error) {
		throw error;
	}
};
