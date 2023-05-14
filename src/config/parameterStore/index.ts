const AWS = require('aws-sdk');
const ssmSDK = new AWS.SSM();

export const getParametersSSM = async (parameterNames: string[]) => {
	const parameters = await ssmSDK
		.getParameters({
			Names: parameterNames,
		})
		.promise();

	const keys: any = {
		'/S3/BUCKET/APPSTORAGE': 'AppStorage',
		'/DYNAMODB/APIPRODUCTOSSTACK/PRODUCTS': 'ProductsTable',
	};

	console.log({ parameters: parameters.Parameters });

	const result = parameters.Parameters.reduce((acc: any, parameter: any) => {
		acc[keys[parameter.Name]] = parameter.Value;
		return acc;
	}, {});

	return result;
};

export const getParameterSSM = async ({ parameterName }: { parameterName: string }) => {
	return await ssmSDK
		.getParameter({
			Name: parameterName,
		})
		.promise();
};

export const getParametersAPI = async () => {
	const {
		Parameter: { Value: v1 },
	} = await getParameterSSM({
		parameterName: '/S3/BUCKET/APPSTORAGE',
	});
	const {
		Parameter: { Value: v2 },
	} = await getParameterSSM({
		parameterName: '/DYNAMODB/APIPRODUCTOSSTACK/PRODUCTS',
	});

	return {
		AppStorage: v1,
		ProductsTable: v2,
	};
};
