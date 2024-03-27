import { App } from "aws-cdk-lib";
import { CDKSnapStack } from "../src";

describe("CDKSnapStack", () => {
	let stack: CDKSnapStack;

	beforeEach(() => {
		const app = new App();
		stack = new CDKSnapStack(app, "quick-snap-test", {});
	});

	it("should create a DynamoDB ARN", () => {
		const arn = stack.getDynamoDbArn("TestTable");
		expect(arn).toBe(
			`arn:aws:dynamodb:${stack.region}:${stack.account}:table/TestTable`
		);
	});

	it("should create DynamoDB resource ARNs", () => {
		const arns = stack.createDynamoDbResourceArns(["TestTable1", "TestTable2"]);
		expect(arns).toEqual([
			`arn:aws:dynamodb:${stack.region}:${stack.account}:table/TestTable1`,
			`arn:aws:dynamodb:${stack.region}:${stack.account}:table/TestTable2`,
		]);
	});

	it("should create IAM actions", () => {
		const actions = stack.createIamActions("resource", ["action1", "action2"]);
		expect(actions).toEqual(["resource:action1", "resource:action2"]);
	});
});
