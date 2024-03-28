import { App, Stack } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { CreateFunctionOptions, createCompiledFunction } from "../src/lambda"; // replace './lambda' with the actual file path
import { CDKSnapStack } from "../src";

let app: App;
let stackName = "TestStack";
let stackProps = {};
let stack: CDKSnapStack;
let role: Role;

describe("createCompiledFunction", () => {
	beforeEach(() => {
		app = new App();
		stack = new CDKSnapStack(app, stackName, stackProps);
		role = new Role(stack, "TestRole", {
			assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
		});
	});

	it("should throw an error if no role is provided", () => {
		const options: CreateFunctionOptions = {
			location: "test",
			name: "TestFunction",
		};
		expect(() => createCompiledFunction(stack, options)).toThrow(
			"Role must be provided for the function."
		);
	});

	it("should create a function with the provided options", () => {
		const options: CreateFunctionOptions = {
			environment: { TEST_ENV: "test" },
			location: "test",
			name: "TestFunction",
			props: {
				runtime: Runtime.NODEJS_14_X,
			},
			role,
		};
		const func = createCompiledFunction(stack, options);
		expect(func).toBeDefined();
		expect(func.role).toBe(role);
		expect(func.runtime).toBe(Runtime.NODEJS_14_X);
	});
});
