import {
	BasePathMapping,
	DomainName,
	LambdaIntegration,
	MethodOptions,
	Resource,
	RestApi,
	RestApiProps,
} from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { CDKSnapStack } from "./stack";
import { mergeResources } from "./util";

/**
 * @name CDKSnapApiFunctions
 * @description API functions to add to the REST API.
 *
 * @param path - Path of the API function
 * @param method - HTTP method of the API function
 * @param function - Lambda function to integrate with the API, can also be NodeJSFunction
 */
export interface CDKSnapApiFunctions {
	path: string;
	method: string;
	function: Function | NodejsFunction;
	methodOptions?: MethodOptions;
	isProxy?: boolean;
}

/**
 * @name CDKSnapApiResource
 * @description API resources to add to the REST API.
 *
 * @param path - Path of the API resource
 * @param resources - List of resources to add to the API resource
 * @param method - HTTP method of the API resource
 * @param function - Lambda function to integrate with the API resource, also allows for NodeJSFunction
 */
export interface CDKSnapApiResource {
	path: string;
	resources?: CDKSnapApiResource[];
	methods?: CDKSnapApiResourceMethod[];
	isProxy?: boolean;
}

export interface CDKSnapApiResourceMethod {
	verb: string;
	function: Function | NodejsFunction;
	methodOptions?: MethodOptions;
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
 * @param props - Additional properties for the REST API
 */
export interface CreateRestApiOptions {
	apiFunctions?: CDKSnapApiFunctions[];
	resources?: CDKSnapApiResource[];
	apiMapping?: CreateRestApiMappingOptions;
	apiName?: string;
	description?: string;
	version?: string;
	props?: RestApiProps;
}

export interface CreateRestApiMappingOptions {
	basePath: string;
	domainName: string;
	domainNameAliasHostedZoneId: string;
	domainNameAliasTarget: string;
}

const attachResources = (
	rootResource: Resource,
	resources: CDKSnapApiResource[]
) => {
	for (let resource of resources) {
		const apiResource = rootResource.addResource(resource.path);
		if (resource.resources) {
			attachResources(apiResource, resource.resources);
		}

		if (resource.methods?.length) {
			for (let method of resource.methods) {
				apiResource.addMethod(
					method.verb,
					new LambdaIntegration(method.function, {
						proxy: resource.isProxy,
					}),
					method.methodOptions
				);
			}
		}
	}
};

export const createRestApi = (
	stack: CDKSnapStack,
	{
		apiFunctions,
		description,
		apiMapping,
		version,
		resources,
		props,
	}: CreateRestApiOptions
): RestApi => {
	const restApi = new RestApi(stack, stack.resourceName("RestApi"), {
		restApiName: stack.resourceName("RestApi"),
		description: description || "This is a REST API",
		...props,
	});

	// We version the API to avoid breaking changes.
	const versionedRestApi = restApi.root.addResource(version || "v1");

	if (resources) {
		attachResources(versionedRestApi, mergeResources(resources));
	}

	if (apiFunctions) {
		for (const apiFunction of apiFunctions) {
			versionedRestApi
				.addResource(apiFunction.path)
				.addMethod(
					apiFunction.method,
					new LambdaIntegration(apiFunction.function, {
						proxy: apiFunction.isProxy,
					}),
					apiFunction.methodOptions
				);
		}
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
