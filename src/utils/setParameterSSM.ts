import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
// const AWS = require('aws-sdk');
// const ssmSDK = new AWS.SSM();

export const setParameterSSM = ({
	scope,
	parameterName,
	parameterValue,
	parameterType = ssm.ParameterType.STRING,
	parameterDescription = '',
}: {
	scope: cdk.Construct;
	parameterName: string;
	parameterValue: string;
	parameterType?: ssm.ParameterType;
	parameterDescription?: string;
}) => {
	return new ssm.StringParameter(scope, parameterName.toUpperCase(), {
		description: parameterDescription,
		parameterName: parameterName.toUpperCase(),
		stringValue: parameterValue,
		tier: ssm.ParameterTier.STANDARD,
	});
};
