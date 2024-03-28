import { Code, Function, FunctionProps, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import { Role } from "aws-cdk-lib/aws-iam";

interface CreateFunctionOptions {
	name: string;
	environment?: { [key: string]: string };
	location: string;
	role?: Role;
	props?: Partial<FunctionProps>;
}
/**
 * @name CreateCompiledFunction
 * @description This function creates a Lambda function with the provided options.
 */
export const createCompiledFunction = (
	stack: Construct,
	{ name, environment, location, role, props }: CreateFunctionOptions
) => {
	if (!role && !props?.role) {
		throw new Error("Role must be provided for the function.");
	}

	return new Function(stack, name, {
		...props,
		runtime: props?.runtime || Runtime.PROVIDED_AL2023,
		handler: props?.handler || "main",
		code:
			props?.code ||
			Code.fromAsset(path.join(process.cwd(), "bin", "functions", location)),
		environment: props?.environment || {
			STAGE: process.env["STAGE"] || "",
			REGION: process.env["REGION"] || "",
			...environment,
		},
		role: props?.role || role,
	});
};
