import {
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import {
	CDKSnapManagedPolicy,
	type CDKSnapDynamoDBAccessOptions,
	type CDKSnapStack,
} from "..";
import { CloudWatchLogsAction, DynamoDbAction } from "../enums";
import { CDKSnapPrincipal } from "../principal";
import { CDKSnapRoleOptions } from "./role.meta";

/**
 * @name CreateLambdaExecutionRoleOptions
 * @description Options for creating the Lambda execution role.
 *
 * @param dynamoDb - CDKSnapDynamoDBAccessOptions for the DynamoDB table
 * @param enableCloudWatchLogs - Enable CloudWatch Logs access. Defaults to true
 * @extends CDKSnapRoleOptions
 */
export interface CreateLambdaExecutionRoleOptions extends CDKSnapRoleOptions {
	dynamoDb?: CDKSnapDynamoDBAccessOptions;
	enableCloudWatchLogs?: boolean;
}

// Defaults
const defaultRoleName = "LambdaExecutionRole";
const defaultDynamoDbActions = [
	DynamoDbAction.GetItem,
	DynamoDbAction.PutItem,
	DynamoDbAction.UpdateItem,
	DynamoDbAction.DeleteItem,
];

/**
 * @name createLambdaExecutionRole
 * @description This role is used by the Lambda function to access other AWS services.
 */
export const createLambdaExecutionRole = (
	stack: CDKSnapStack,
	{
		dynamoDb,
		enableCloudWatchLogs = true,
		policyStatements,
		props,
		roleName,
		useStackName = true,
	}: CreateLambdaExecutionRoleOptions
) => {
	const role = new Role(
		stack,
		stack.buildRoleName(useStackName, defaultRoleName, roleName),
		{
			...props,
			assumedBy:
				props?.assumedBy || new ServicePrincipal(CDKSnapPrincipal.Lambda),
			managedPolicies: props?.managedPolicies || [
				ManagedPolicy.fromAwsManagedPolicyName(
					CDKSnapManagedPolicy.AWSLambdaBasicExecutionRole
				),
			],
		}
	);

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
