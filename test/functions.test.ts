import { Stack } from "aws-cdk-lib";
import { Role } from "aws-cdk-lib/aws-iam";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { createCompiledFunction } from "../src";

jest.mock("aws-cdk-lib/aws-lambda", () => {
	return {
		Function: jest.fn(),
		Runtime: {
			PROVIDED_AL2023: "PROVIDED_AL2023",
		},
		Code: {
			fromAsset: jest.fn(),
		},
	};
});

jest.mock("aws-cdk-lib/aws-iam", () => {
	return {
		Role: jest.fn(),
	};
});

describe("createCompiledFunction", () => {
	it("should create a new function", () => {
		const stack = new Stack();
		const role = new Role(stack, "TestRole", {
			assumedBy: jest.fn() as any,
		});

		createCompiledFunction(stack, {
			name: "TestFunction",
			environment: { TEST_ENV: "test" },
			location: "test-location",
			role,
		});

		expect(Function).toHaveBeenCalledWith(
			stack,
			"TestFunction",
			expect.objectContaining({
				runtime: Runtime.PROVIDED_AL2023,
				handler: "main",
				code: Code.fromAsset(
					path.join(__dirname, "../", "bin", "functions", "test-location")
				),
				environment: expect.objectContaining({
					STAGE: expect.any(String),
					REGION: expect.any(String),
					TEST_ENV: "test",
				}),
				role,
			})
		);
	});
});
