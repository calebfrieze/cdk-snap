import { Stack } from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { createOutputs } from "../src";

jest.mock("aws-cdk-lib", () => {
	return {
		CfnOutput: jest.fn(),
		Stack: jest.fn(),
	};
});

describe("createOutputs", () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		// Store the original process.env
		originalEnv = process.env;
		// Mock process.env
		process.env = { ...originalEnv, STAGE: "test" };
	});

	afterEach(() => {
		// Restore the original process.env
		process.env = originalEnv;
	});

	it("should create outputs", () => {
		const stack = new Stack();

		createOutputs(stack, {
			outputs: [
				{
					name: "TestOutput",
					value: "test-value",
					description: "test-description",
				},
			],
		});

		expect(CfnOutput).toHaveBeenCalledWith(stack, "TestOutput", {
			value: "test-value",
			exportName: "TestOutput-test",
			description: "test-description",
		});
	});
});
