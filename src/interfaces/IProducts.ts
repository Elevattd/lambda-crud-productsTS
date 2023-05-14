interface IProducts {
	id?: string;
	active?: boolean;
	name: string;
	status: string;
	stock: number;
	unitsSold?: number;
	idCurrency: number;
	idBrand: string;
	idCategory: string;
	idProvider: string;
	total: number;
	cost: number;
	totalARS: number;
	costARS: number;
	iva: [
		{
			id: number;
			percentage: number;
		},
	];
	description: string;
	observations: string;
	dateCreation?: string;
	userCreation: String;
	dateUpdate?: string;
	userUpdate?: String;
	dateDelete?: string;
	userDelete?: String;
}

export default IProducts;
