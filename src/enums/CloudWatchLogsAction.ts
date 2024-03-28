/**
 * @name CloudWatchLogsAction
 * @description Actions that can be performed on CloudWatch Logs resources
 */
export const CloudWatchLogsAction = {
	All: "*",
	CreateLogGroup: "CreateLogGroup",
	CreateLogStream: "CreateLogStream",
	DeleteLogGroup: "DeleteLogGroup",
	DeleteLogStream: "DeleteLogStream",
	DeleteRetentionPolicy: "DeleteRetentionPolicy",
	DescribeLogGroups: "DescribeLogGroups",
	DescribeLogStreams: "DescribeLogStreams",
	DescribeMetricFilters: "DescribeMetricFilters",
	FilterLogEvents: "FilterLogEvents",
	GetLogEvents: "GetLogEvents",
	PutLogEvents: "PutLogEvents",
	PutMetricFilter: "PutMetricFilter",
	PutRetentionPolicy: "PutRetentionPolicy",
	TestMetricFilter: "TestMetricFilter",
};
