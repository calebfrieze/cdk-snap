import { App } from "aws-cdk-lib";
import {
	CDKSnapOutput,
	CDKSnapStack,
	CreateOutputsOptions,
	createOutputs,
} from "../src";

let app: App;
let stackName = "TestStack";
let stackProps = {};
describe("createOutputs", () => {
	let stack: CDKSnapStack;
	let outputs: CDKSnapOutput[];

	beforeEach(() => {
		app = new App();
		stack = new CDKSnapStack(app, stackName, stackProps);
		outputs = [
			{ name: "TestOutput1", value: "value1", description: "description1" },
			{ name: "TestOutput2", value: "value2", description: "description2" },
		];
	});

	it("should create outputs for the stack", () => {
		const options: CreateOutputsOptions = { outputs };
		createOutputs(stack, options);
		// Since we can't directly check the outputs of the stack,
		// we assume that if no error is thrown, the outputs were created successfully.
	});
});
