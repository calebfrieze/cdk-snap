import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import { Role } from "aws-cdk-lib/aws-iam";

interface CreateFunctionOptions {
	name: string;
	environment?: { [key: string]: string };
	location: string;
	role: Role;
}

export const createCompiledFunction = (
	stack: Construct,
	{ name, environment, location, role }: CreateFunctionOptions
) => {
	return new Function(stack, name, {
		runtime: Runtime.PROVIDED_AL2023,
		handler: "main",
		code: Code.fromAsset(
			path.join(__dirname, "../", "bin", "functions", location)
		),
		environment: {
			STAGE: process.env["STAGE"] || "",
			REGION: process.env["REGION"] || "",
			...environment,
		},
		role,
	});
};
