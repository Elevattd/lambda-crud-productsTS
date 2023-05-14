import IProducts from '../interfaces/IProducts';
import { Response } from './Response';
import { getProducts } from '../controllers/getProducts';
import { createProduct } from '../controllers/createProduct';
import { updateProduct } from '../controllers/updateProduct';
import { deleteProduct } from '../controllers/deleteProduct';
import { getParametersSSM } from '../config/parameterStore';
import { getProductId } from '../controllers/getProductId';

class Product {
	private tableName: string;

	constructor(tableName?: string) {
		if (tableName) {
			this.tableName = tableName;
		}
	}
	async initialize() {
		const { ProductsTable } = await getParametersSSM(['/DYNAMODB/APIPRODUCTOSSTACK/PRODUCTS']);
		this.tableName = ProductsTable;
	}

	public async create(productData: IProducts): Promise<Response> {
		const createdProduct = await createProduct(productData, this.tableName);
		return createdProduct;
	}

	public async update(product: IProducts): Promise<Partial<Response>> {
		const updatedProduct = await updateProduct(product, this.tableName);
		return updatedProduct;
	}

	public async delete(productId: string): Promise<Partial<Response>> {
		const deletedProduct = await deleteProduct(productId, this.tableName);
		return deletedProduct;
	}

	public async getById(productId: string): Promise<Partial<Response>> {
		const productFound = await getProductId(productId, this.tableName);
		return productFound;
	}
	public async getProducts(): Promise<Partial<Response>> {
		const allProducts = await getProducts(this.tableName);
		return allProducts;
	}
}

export default Product;
