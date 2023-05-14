export const AWS = require('aws-sdk');
export const docClient = new AWS.DynamoDB.DocumentClient();
export const scanAllItems = async (params: any) => {
	let lastEvaluatedKey = 'dummy'; // string must not be empty
	const itemsAll = [];
	while (lastEvaluatedKey) {
		const data = await docClient.scan(params).promise();
		itemsAll.push(...data.Items);
		lastEvaluatedKey = data.LastEvaluatedKey;
		if (lastEvaluatedKey) {
			params.ExclusiveStartKey = lastEvaluatedKey;
		}
	}
	return itemsAll;
};

export const insertItem = async (params: any) => {
	const data = await docClient.put(params).promise();
	return data;
};

export const updateItem = async (params: any) => {
	const data = await docClient.update(params).promise();
	return data;
};

export const getItem = async (params: any) => {
	const { Item } = await docClient.get(params).promise();
	return Item;
};

const getRandomStrings = (length: any) => {
	const value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const randoms = [];
	for (let i = 0; i < length; i++) {
		randoms.push(value[Math.floor(Math.random() * value.length)]);
	}
	return randoms.join('');
};

export const generateINQuery = (values: string[], atrName: string) => {
	const inValue = `#${atrName} IN(`;
	const concat: string[] = [];
	const exp = values.reduce(
		(acc, v, i) => {
			const char = getRandomStrings(2);
			const keyExp = `:${char}`;
			concat.push(keyExp);
			if (acc['ExpressionAttributeValues']) {
				acc['ExpressionAttributeValues'] = {
					...acc['ExpressionAttributeValues'],
					[keyExp]: v,
				};
				return acc;
			}
			acc['ExpressionAttributeValues'] = {
				[keyExp]: v,
			};
			return acc;
		},
		{
			ExpressionAttributeNames: { [`#${atrName}`]: atrName },
			ExpressionAttributeValues: {},
		},
	);
	return {
		...exp,
		filter: inValue + concat.join(',') + ')',
	};
};

export const getUpdateParams = ({
	values,
	excludeKeys,
	TableName,
}: {
	values: any;
	excludeKeys: string[];
	TableName: string;
}) => {
	const ATTRIBUTES = Object.keys(values)
		.filter((key) => values[key] || typeof values[key] === 'boolean')
		.filter((k) => !excludeKeys.includes(k));

	const UpdateParams = {
		TableName,
		Key: {
			ID: values.ID,
		},
		ExpressionAttributeValues: {},
		ExpressionAttributeNames: {},
		UpdateExpression: 'set ',
		ReturnValues: 'UPDATED_NEW',
	};

	ATTRIBUTES.forEach((attribute, index) => {
		UpdateParams['UpdateExpression'] += `#${attribute} = :${attribute}${index < ATTRIBUTES.length - 1 ? ', ' : ''}`;

		//@ts-ignore
		UpdateParams['ExpressionAttributeValues'][`:${attribute}`] = values[attribute];
		//@ts-ignore
		UpdateParams['ExpressionAttributeNames'][`#${attribute}`] = attribute;
	});

	return UpdateParams;
};
