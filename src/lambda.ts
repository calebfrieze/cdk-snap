import { Role } from "aws-cdk-lib/aws-iam";
import { Code, Function, FunctionProps, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

/**
 * @name CreateFunctionOptions
 * @description Options for creating the Lambda function.
 *
 * @param environment - Environment variables for the function
 * @param location - Location of the function code, combined with the current working directory
 * @param name - Name of the function
 * @param props - Additional properties for the function
 * @param role - Role for the function
 */
export interface CreateFunctionOptions {
	environment?: Record<string, string>;
	location: string;
	name: string;
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
