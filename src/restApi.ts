import {
	BasePathMapping,
	DomainName,
	LambdaIntegration,
	RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";
import type { CDKSnapStack } from "./stack";
interface CreateRestApiOptions {
	description?: string;
	apiName?: string;
	apiMapping?: CreateRestApiMappingOptions;
	apiFunctions: { path: string; method: string; function: Function }[];
	version?: string;
}
interface CreateRestApiMappingOptions {
	basePath: string;
	domainName: string;
	domainNameAliasHostedZoneId: string;
	domainNameAliasTarget: string;
}
export const createRestApi = (
	stack: CDKSnapStack,
	{ apiFunctions, description, apiMapping, version }: CreateRestApiOptions
): RestApi => {
	const restApi = new RestApi(stack, stack.resourceName("RestApi"), {
		restApiName: stack.resourceName("RestApi"),
		description: description || "This is a REST API",
	});

	// We version the API to avoid breaking changes.
	const v1RestApi = restApi.root.addResource(version || "v1");

	for (const apiFunction of apiFunctions) {
		v1RestApi
			.addResource(apiFunction.path)
			.addMethod(
				apiFunction.method,
				new LambdaIntegration(apiFunction.function)
			);
	}
	if (!apiMapping) {
		return restApi;
	}

	const domainName = DomainName.fromDomainNameAttributes(
		stack,
		stack.resourceName("DomainName"),
		{
			domainName: apiMapping.domainName,
			domainNameAliasHostedZoneId: apiMapping.domainNameAliasHostedZoneId,
			domainNameAliasTarget: apiMapping.domainNameAliasTarget,
		}
	);
	// This is how you map the base path to the API Gateway. The base path is the root of the URL.
	new BasePathMapping(stack, stack.resourceName("BasePathMapping"), {
		domainName,
		restApi,
		basePath: apiMapping.basePath,
	});

	return restApi;
};
