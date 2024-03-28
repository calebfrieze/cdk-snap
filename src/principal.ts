/**
 * @name CDKSnapPrincipal
 * @description Principals are AWS services that can assume roles.
 */
export const CDKSnapPrincipal = {
	Lambda: "lambda.amazonaws.com",
	Firehose: "firehose.amazonaws.com",
	Glue: "glue.amazonaws.com",
	Logs: "logs.amazonaws.com",
	S3: "s3.amazonaws.com",
	CloudWatch: "cloudwatch.amazonaws.com",
	DynamoDB: "dynamodb.amazonaws.com",
};
