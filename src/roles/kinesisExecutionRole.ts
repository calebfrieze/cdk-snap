import {
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { CDKSnapStack, CloudWatchLogsAction, LambdaAction, S3Action } from "..";

interface CreateKinesisExecutionRoleOptions {
	// Define options for the role
	bucket: {
		arn: string;
	};
}

export const createKinesisExecutionRole = (
	stack: CDKSnapStack,
	{ bucket }: CreateKinesisExecutionRoleOptions
) => {
	const role = new Role(stack, stack.resourceName("KinesisAccessRole"), {
		assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
	});

	const resources: string[] = [];

	if (bucket.arn) {
		resources.push(bucket.arn);
	}

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
			],
			resources,
		})
	);
	return role;
};
