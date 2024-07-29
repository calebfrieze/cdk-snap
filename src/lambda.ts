import { Role } from "aws-cdk-lib/aws-iam";
import { Code, Function, FunctionProps, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import { CDKSnapStack } from ".";

/**
 * @name CreateFunctionOptions
 * @description Options for creating the Lambda function.
 *
 * @param environment - Environment variables for the function
 * @param location - Location of the function code, combined with the current working directory
 * @param name - Name of the function
 * @param handler - Handler for the function
 * @param props - Additional properties for the function
 * @param role - Role for the function
 */
export interface CreateFunctionOptions {
	environment?: Record<string, string>;
	location: string;
	name: string;
	handler?: string;
	props?: Partial<FunctionProps>;
	role?: Role;
}

/**
 * @name CreateCompiledFunction
 * @description This function creates a Lambda function with the provided options.
 */
export const createCompiledFunction = (
	stack: Construct,
	{ environment, location, name, props, role }: CreateFunctionOptions
) => {
	if (!role && !props?.role) {
		throw new Error("Role must be provided for the function.");
	}

	return new Function(stack, name, {
		...props,
		code: props?.code || Code.fromAsset(path.join(process.cwd(), location)),
		environment: props?.environment || {
			STAGE: process.env["STAGE"] || "",
			REGION: process.env["REGION"] || "",
			...environment,
		},
		handler: props?.handler || "main",
		role: props?.role || role,
		runtime: props?.runtime || Runtime.PROVIDED_AL2023,
	});
};

/**
 * @name createPythonFunction
 * @description This function creates a Lambda function with the provided options. Uses Python 3.12 as default
 */
/**
 * @name createPythonFunction
 * @description This function creates a Lambda function with the provided options. Uses Python 3.12 as default
 */
export const createPythonFunction = (
	stack: CDKSnapStack,
	{ role, props, name, location, environment, handler }: CreateFunctionOptions
) => {
	if (!role && !props?.role) {
		throw new Error("Role must be provided for the function.");
	}

	return new Function(stack, stack.resourceName(name), {
		...props,
		runtime: props?.runtime || Runtime.PYTHON_3_12,
		role: props?.role || role,
		handler:
			props?.handler || `${location.replace("/", ".")}.${handler || "handler"}`,
		code:
			props?.code ||
			Code.fromAsset(path.join(process.cwd(), location.split(".")[0])),
		environment: props?.environment || {
			STAGE: process.env["STAGE"] || "",
			REGION: process.env["REGION"] || "",
			...environment,
		},
	});
};

/**
 * @name createJavascriptFunction
 * @description Function to create a Lambda function with the provided options. Uses NodeJS 20 as default
 */
export const createJavascriptFunction = (
	stack: CDKSnapStack,
	{ role, props, name, location, environment, handler }: CreateFunctionOptions
) => {
	if (!role && !props?.role) {
		throw new Error("Role must be provided for the function.");
	}

	return new Function(stack, stack.resourceName(name), {
		...props,
		runtime: props?.runtime || Runtime.NODEJS_20_X,
		role: props?.role || role,
		handler: props?.handler || `${handler || "handler"}`,
		code: props?.code || Code.fromAsset(location),
		environment: props?.environment || {
			STAGE: process.env["STAGE"] || "",
			REGION: process.env["REGION"] || "",
			...environment,
		},
	});
};
