import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambdaNodeJs from '@aws-cdk/aws-lambda-nodejs';
import { setParameterSSM } from '../src/utils/setParameterSSM';

let GraphQLApi_Name = 'ApiProductosStack';
let lambdaFuncion_Name = 'ApiProductosStack-handler';

let DynamoDB = [
	{
		table: 'products',
		key: 'ID',
	},
];

let lambdaResolvers = [
	{ name: 'createProduct', type: 'Mutation' },
	{ name: 'deleteProduct', type: 'Mutation' },
	{ name: 'updateProduct', type: 'Mutation' },
	{ name: 'getProductId', type: 'Query' },
	{ name: 'getProducts', type: 'Query' },
];

export class ApiProductosStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const api = new appsync.GraphqlApi(this, 'API-PRODUCTOS', {
			name: GraphQLApi_Name,
			schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.API_KEY,
					apiKeyConfig: {
						expires: cdk.Expiration.after(cdk.Duration.days(365)),
					},
				},
			},
			xrayEnabled: true,
		});

		// Prints out the AppSync GraphQL endpoint to the terminal
		new cdk.CfnOutput(this, 'GraphQLAPIURL', {
			value: api.graphqlUrl,
		});

		// Prints out the AppSync GraphQL API key to the terminal
		new cdk.CfnOutput(this, 'GraphQLAPIKey', {
			value: api.apiKey || '',
		});

		// Prints out the stack region to the terminal
		new cdk.CfnOutput(this, 'Stack Region', {
			value: this.region,
		});
		new cdk.CfnOutput(this, 'Deploy time', {
			value: new Date().toISOString(),
		});

		const lambdaARole = iam.Role.fromRoleArn(
			this,
			process.env.AWS_LAMBDA_ROL_NAME as string,
			process.env.AWS_LAMBDA_ROL_ARN as string,
			{
				mutable: false,
			},
		);

		const templateHandlerLambda = new lambdaNodeJs.NodejsFunction(this, lambdaFuncion_Name, {
			runtime: lambda.Runtime.NODEJS_16_X,
			handler: 'handler',
			entry: 'src/lambda/main.ts',
			timeout: cdk.Duration.seconds(300),
			memorySize: 1024,
			bundling: {
				nodeModules: ['guid-typescript'],
			},
			role: lambdaARole,
		});

		const lambdaDs = api.addLambdaDataSource('lambdaDatasource', templateHandlerLambda);

		lambdaResolvers.forEach((resolver) => {
			lambdaDs.createResolver({
				typeName: resolver.type,
				fieldName: resolver.name,
			});
		});

		DynamoDB.forEach((element) => {
			new cdk.CfnOutput(this, 'New table: ', {
				value: `/DYNAMODB/${GraphQLApi_Name.toUpperCase()}/${element.table.toUpperCase()}`,
			});
			const _tableDynamoDB = new ddb.Table(this, element.table, {
				billingMode: ddb.BillingMode.PAY_PER_REQUEST,
				partitionKey: {
					name: element.key,
					type: ddb.AttributeType.STRING,
				},
			});

			_tableDynamoDB.grantFullAccess(templateHandlerLambda);

			templateHandlerLambda.addEnvironment(element.table.toUpperCase() + '_TABLE', _tableDynamoDB.tableName);

			setParameterSSM({
				scope: this,
				parameterName: `/DYNAMODB/${GraphQLApi_Name.toUpperCase()}/${element.table.toUpperCase()}`,
				parameterValue: _tableDynamoDB.tableName,
				parameterDescription: `Table name: ${_tableDynamoDB.tableName}`,
			});
		});
	}
}
