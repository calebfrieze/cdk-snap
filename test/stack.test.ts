import { App } from "aws-cdk-lib";
import { CDKSnapStack } from "../src/stack";

let app: any;
let stack: any;
let stackName: any = "TestStack";
let stackProps: any = {};

describe("CDKSnapStack", () => {
	beforeAll(() => {
		app = new App();
		stack = new CDKSnapStack(app, stackName, stackProps);
	});

	it("should create a stack with the provided id", () => {
		expect(stack.stackName).toBe(stackName);
	});

	it("should create a DynamoDB ARN", () => {
		const arn = stack.getDynamoDbArn("TestTable");
		expect(arn).toBe(
			`arn:aws:dynamodb:${stack.region}:${stack.account}:table/TestTable`
		);
	});

	it("should create a Firehose ARN", () => {
		const arn = stack.getFirehoseArn("TestStream");
		expect(arn).toBe(
			`arn:aws:firehose:${stack.region}:${stack.account}:deliverystream/TestStream`
		);
	});

	it("should create a resource name based on the stack name", () => {
		const resourceName = "TestResource";
		const name = stack.resourceName("TestResource");
		expect(name).toBe(`${stackName}-${resourceName}-${process.env["STAGE"]}`);
	});
});
