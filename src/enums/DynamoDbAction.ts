/**
 * @name DynamoDbAction
 * @description Actions that can be performed on DynamoDB resources
 */
export const DynamoDbAction = {
	All: "dynamodb:*",
	BatchGetItem: "BatchGetItem",
	BatchWriteItem: "BatchWriteItem",
	ConditionCheck: "ConditionCheck",
	CreateTable: "CreateTable",
	DeleteItem: "DeleteItem",
	DeleteTable: "DeleteTable",
	DescribeTable: "DescribeTable",
	EnableStream: "EnableStream",
	GetItem: "GetItem",
	ListTables: "ListTables",
	PutItem: "PutItem",
	Query: "Query",
	Scan: "Scan",
	StreamSpecification: "StreamSpecification",
	StreamViewType: "StreamViewType",
	TagResource: "TagResource",
	UntagResource: "UntagResource",
	UpdateItem: "UpdateItem",
	UpdateTable: "UpdateTable",
};
