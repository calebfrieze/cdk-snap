import {
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import type { CDKSnapStack } from "..";
import { DynamoDbAction } from "../enums";
interface CreateAccessRoleOptions {
	dynamoDb: {
		tableName: string;
		resources: string[];
		actions: DynamoDbAction;
	};
	policyStatements?: PolicyStatement[];
}

export const createAccessRole = (
	stack: CDKSnapStack,
	{ dynamoDb, policyStatements }: CreateAccessRoleOptions
) => {
	const role = new Role(stack, stack.resourceName("AccessRole"), {
		assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
	});

	// Attach the AWSLambdaBasicExecutionRole managed policy
	role.addManagedPolicy(
		ManagedPolicy.fromAwsManagedPolicyName(
			"service-role/AWSLambdaBasicExecutionRole"
		)
	);

	if (dynamoDb?.tableName && dynamoDb?.resources) {
		throw new Error(
			"Cannot provide both tableName and resources in dynamoDb options. Please provide only one."
		);
	}
	if (dynamoDb?.tableName) {
		role.addToPolicy(
			new PolicyStatement({
				actions: ["dynamodb:PutItem"],
				resources: [stack.getDynamoDbArn(dynamoDb.tableName)],
			})
		);
	}

	if (dynamoDb?.resources.length) {
		role.addToPolicy(
			new PolicyStatement({
				actions: [...dynamoDb.actions],
				resources: [...dynamoDb.resources],
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
