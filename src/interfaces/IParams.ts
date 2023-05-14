import IProducts from './IProducts';

export interface IParams {
	TableName: string;
	Item: IProducts;
	values: any;
	excludeKeys: string[];
}
