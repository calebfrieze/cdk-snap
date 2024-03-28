import {
	BasePathMapping,
	DomainName,
	LambdaIntegration,
	RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";
import type { CDKSnapStack } from "./stack";

/**
 * @name CDKSnapApiFunctions
 * @description API functions to add to the REST API.
 *
 * @param path - Path of the API function
 * @param method - HTTP method of the API function
 * @param function - Lambda function to integrate with the API
 */
interface CDKSnapApiFunctions {
	path: string;
	method: string;
	function: Function;
}

/**
 * @name CreateRestApiOptions
 * @description Options for creating the REST API.
 *
 * @param description - Description of the REST API
 * @param apiName - Name of the REST API
 * @param apiMapping - Mapping options for the REST API
 * @param apiFunctions - List of API functions to add to the REST API
 * @param version - Version of the REST API
 */
interface CreateRestApiOptions {
	apiFunctions: CDKSnapApiFunctions[];
	apiMapping?: CreateRestApiMappingOptions;
	apiName?: string;
	description?: string;
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
