import {
	PolicyStatement,
	Role,
	RoleProps,
	ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import {
	CDKSnapBucketOptions,
	CDKSnapStack,
	CloudWatchLogsAction,
	GlueAction,
	LambdaAction,
	S3Action,
} from "..";

/**
 * @name CreateKinesisExecutionRoleOptions
 * @description Options for creating the Kinesis execution role.
 *
 * @param bucket - CDKSnapBucketOptions for the S3 bucket
 * @param policyStatements - Custom policy statements to add to the role
 * @param props - Additional properties for the role
 */
export interface CreateKinesisExecutionRoleOptions {
	bucket?: CDKSnapBucketOptions;
	policyStatements?: PolicyStatement[];
	props?: RoleProps;
}

/**
 * @name createKinesisExecutionRole
 * @description This role should be used by the Kinesis Firehose Delivery Stream to access other AWS services.
 */
export const createKinesisExecutionRole = (
	stack: CDKSnapStack,
	{ bucket, policyStatements, props }: CreateKinesisExecutionRoleOptions
) => {
	const role = new Role(stack, stack.resourceName("KinesisAccessRole"), {
		...props,
		assumedBy:
			props?.assumedBy || new ServicePrincipal("firehose.amazonaws.com"),
	});

	const resources: string[] = [];

	if (bucket?.arn) {
		resources.push(bucket.arn);
	}

	// arn for any s3 resource
	resources.push("arn:aws:s3:::*");

	// arn for any glue resource
	resources.push("arn:aws:glue:*:*:*");

	// arn for any lambda function
	resources.push("arn:aws:lambda:*:*:*");

	// arn for any logs resource
	resources.push("arn:aws:logs:*:*:*");

	role.addToPolicy(
		new PolicyStatement({
			actions: [
				...stack.createIamActions("s3", [
					S3Action.PutObject,
					S3Action.GetBucketLocation,
				]),
				...stack.createIamActions("lambda", [LambdaAction.InvokeFunction]),
				...stack.createIamActions("logs", [
					CloudWatchLogsAction.CreateLogGroup,
					CloudWatchLogsAction.CreateLogStream,
					CloudWatchLogsAction.PutLogEvents,
				]),
				...stack.createIamActions("glue", [
					GlueAction.GetTable,
					GlueAction.GetTableVersion,
					GlueAction.GetTableVersions,
					GlueAction.GetPartition,
				]),
			],
			resources,
		})
	);

	// Add custom policy statements
	if (policyStatements) {
		for (const statement of policyStatements) {
			role.addToPolicy(statement);
		}
	}
	return role;
};
