import {
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
	type RoleProps,
} from "aws-cdk-lib/aws-iam";
import type { CDKSnapStack } from "..";
import { DynamoDbAction } from "../enums";

interface CreateLambdaExecutionRoleOptions {
	dynamoDb: {
		tableName?: string;
		resources?: string[];
		actions: (typeof DynamoDbAction)[keyof typeof DynamoDbAction][];
	};
	policyStatements?: PolicyStatement[];
	roleProps?: RoleProps;
}

export const createLambdaExecutionRole = (
	stack: CDKSnapStack,
	{ dynamoDb, policyStatements, roleProps }: CreateLambdaExecutionRoleOptions
) => {
	const role = new Role(stack, stack.resourceName("AccessRole"), {
		...(roleProps && { ...roleProps }),
		assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
		managedPolicies: [
			ManagedPolicy.fromAwsManagedPolicyName(
				"service-role/AWSLambdaBasicExecutionRole"
			),
		],
	});

	if (dynamoDb?.tableName && dynamoDb?.resources) {
		throw new Error(
			"Cannot provide both tableName and resources in dynamoDb options. Please provide only one."
		);
	}
	if (dynamoDb?.tableName) {
		role.addToPolicy(
			new PolicyStatement({
				actions: stack.createIamActions(dynamoDb.actions, "dynamodb"),
				resources: [stack.getDynamoDbArn(dynamoDb.tableName)],
			})
		);
	}

	if (dynamoDb?.resources?.length) {
		role.addToPolicy(
			new PolicyStatement({
				actions: stack.createIamActions(dynamoDb.actions, "dynamodb"),
				resources: stack.createDynamoDbResourceArns(dynamoDb.resources),
			})
		);
	}

	// Add custom policy statements
	if (policyStatements) {
		for (const statement of policyStatements) {
			role.addToPolicy(statement);
		}
	}

	return role;
};
