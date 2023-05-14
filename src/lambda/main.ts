import Product from '../classes/Product';
import { IAppSyncEvent } from '../interfaces/IAppSyncEvent';

interface IOperations {
	[key: string]: (product: any) => Promise<any>;
}

exports.handler = async (event: IAppSyncEvent) => {
	let result;

	const {
		arguments: { product, id },
		info: { fieldName },
	} = event;

	const newProduct = new Product();
	await newProduct.initialize();

	const productOperations: IOperations = {
		createProduct: (product: any) => newProduct.create(product),
		updateProduct: (product: any) => newProduct.update(product),
		deleteProduct: (id: string) => newProduct.delete(id),
		getProductId: (id: string) => newProduct.getById(id),
		getProducts: (id: string) => newProduct.getProducts(),
	};

	const productOperation = productOperations[fieldName];
	if (productOperation) {
		result = await productOperation(product);
	} else {
		result = `Option not found: ${fieldName}`;
	}
	return result;
};
