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
			description: "test-description",
		});
	});
});
