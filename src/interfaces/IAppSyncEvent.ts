import { Guid } from 'guid-typescript';
import IFilters from './IFilters';
import IProducts from './IProducts';
import { IHeaders } from './IHeaders';

export interface IAppSyncEvent {
	info: {
		fieldName: string;
	};
	arguments: {
		id: string & Guid;
		filters: IFilters;
		product: IProducts;
	};
	request: {
		headers: IHeaders;
	};
}
