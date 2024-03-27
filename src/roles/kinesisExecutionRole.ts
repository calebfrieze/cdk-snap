import {
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import {
	CDKSnapStack,
	CloudWatchLogsAction,
	GlueAction,
	LambdaAction,
	S3Action,
} from "..";

interface CreateKinesisExecutionRoleOptions {
	// Define options for the role
	bucket?: {
		arn: string;
	};
	policyStatements?: PolicyStatement[];
}

export const createKinesisExecutionRole = (
	stack: CDKSnapStack,
	{ bucket, policyStatements }: CreateKinesisExecutionRoleOptions
) => {
	const role = new Role(stack, stack.resourceName("KinesisAccessRole"), {
		assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
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
