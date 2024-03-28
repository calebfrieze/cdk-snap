/**
 * @name FirehoseAction
 * @description Actions that can be performed on Firehose resources
 */
export const FirehoseAction = {
	All: "*",
	CreateDeliveryStream: "CreateDeliveryStream",
	DeleteDeliveryStream: "DeleteDeliveryStream",
	DescribeDeliveryStream: "DescribeDeliveryStream",
	GetAll: "Get*",
	ListAll: "List*",
	ListDeliveryStreams: "ListDeliveryStreams",
	ListTagsForDeliveryStream: "ListTagsForDeliveryStream",
	PutRecord: "PutRecord",
	PutRecordBatch: "PutRecordBatch",
	StartDeliveryStreamEncryption: "StartDeliveryStreamEncryption",
	StopDeliveryStreamEncryption: "StopDeliveryStreamEncryption",
	TagDeliveryStream: "TagDeliveryStream",
	UntagDeliveryStream: "UntagDeliveryStream",
	UpdateDestination: "UpdateDestination",
};
