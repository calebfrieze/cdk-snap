import {
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
	type RoleProps,
} from "aws-cdk-lib/aws-iam";
import type { CDKSnapStack } from "..";
import { CloudWatchLogsAction, DynamoDbAction } from "../enums";

interface CreateLambdaExecutionRoleOptions {
	dynamoDb?: {
		tableNames?: string[];
		// Override default actions
		actions?: (typeof DynamoDbAction)[keyof typeof DynamoDbAction][];
		overrideActions?: boolean;
	};
	enableCloudWatchLogs?: boolean;
	policyStatements?: PolicyStatement[];
	props?: RoleProps;
}

const defaultDynamoDbActions = [
	DynamoDbAction.GetItem,
	DynamoDbAction.PutItem,
	DynamoDbAction.UpdateItem,
	DynamoDbAction.DeleteItem,
];

/**
 * @name CreateLambdaExecutionRole
 * @description This role is used by the Lambda function to access other AWS services.
 * @param dynamoDb.actions - Actions to either override or add to the default DynamoDB actions
 * @param dynamoDb.overrideActions - Override default actions for DynamoDB access
 * @param dynamoDb.tableNames - List of DynamoDB table names to access
 * @param enableCloudWatchLogs - Enable CloudWatch Logs access
 * @param policyStatements - Custom policy statements to add to the role
 * @param props - Additional properties for the role
 */
export const createLambdaExecutionRole = (
	stack: CDKSnapStack,
	{
		dynamoDb,
		policyStatements,
		props,
		enableCloudWatchLogs,
	}: CreateLambdaExecutionRoleOptions
) => {
	const role = new Role(stack, stack.resourceName("AccessRole"), {
		...props,
		assumedBy: props?.assumedBy || new ServicePrincipal("lambda.amazonaws.com"),
		managedPolicies: props?.managedPolicies || [
			ManagedPolicy.fromAwsManagedPolicyName(
				"service-role/AWSLambdaBasicExecutionRole"
			),
		],
	});

	// Add DynamoDB policy statements
	const dynamoDbActions = dynamoDb?.overrideActions
		? dynamoDb?.actions || []
		: dynamoDb?.actions?.length
		? [...dynamoDb?.actions, ...defaultDynamoDbActions]
		: defaultDynamoDbActions;

	if (dynamoDb?.tableNames?.length) {
		for (const tableName of dynamoDb.tableNames) {
			role.addToPolicy(
				new PolicyStatement({
					actions: stack.createIamActions("dynamodb", dynamoDbActions),
					resources: [stack.getDynamoDbArn(tableName)],
				})
			);
		}
	}

	// Add CloudWatch policy statements
	if (enableCloudWatchLogs) {
		role.addToPolicy(
			new PolicyStatement({
				actions: stack.createIamActions("logs", [
					CloudWatchLogsAction.CreateLogGroup,
					CloudWatchLogsAction.CreateLogStream,
					CloudWatchLogsAction.PutLogEvents,
				]),
				resources: ["arn:aws:logs:*:*:*"],
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
