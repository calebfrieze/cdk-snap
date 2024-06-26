/**
 * @name S3Action
 * @description Actions that can be performed on S3 buckets and objects
 */
export const S3Action = {
	AbortMultipartUpload: "AbortMultipartUpload",
	All: "s3:*",
	CreateAccessPoint: "CreateAccessPoint",
	CreateBucket: "CreateBucket",
	CreateJob: "CreateJob",
	DeleteAccessPoint: "DeleteAccessPoint",
	DeleteAccessPointPolicy: "DeleteAccessPointPolicy",
	DeleteBucket: "DeleteBucket",
	DeleteBucketPolicy: "DeleteBucketPolicy",
	DeleteBucketWebsite: "DeleteBucketWebsite",
	DeleteJob: "DeleteJob",
	DeleteObject: "DeleteObject",
	DeleteObjectTagging: "DeleteObjectTagging",
	DeleteObjectVersion: "DeleteObjectVersion",
	DeleteObjectVersionTagging: "DeleteObjectVersionTagging",
	GetAccelerateConfiguration: "GetAccelerateConfiguration",
	GetAccessPoint: "GetAccessPoint",
	GetAccessPointPolicy: "GetAccessPointPolicy",
	GetAccessPointPolicyStatus: "GetAccessPointPolicyStatus",
	GetAll: "Get*",
	GetAnalyticsConfiguration: "GetAnalyticsConfiguration",
	GetBucketAcl: "GetBucketAcl",
	GetBucketCORS: "GetBucketCORS",
	GetBucketLocation: "GetBucketLocation",
	GetBucketLogging: "GetBucketLogging",
	GetBucketNotification: "GetBucketNotification",
	GetBucketObjectLockConfiguration: "GetBucketObjectLockConfiguration",
	GetBucketPolicy: "GetBucketPolicy",
	GetBucketPolicyStatus: "GetBucketPolicyStatus",
	GetBucketPublicAccessBlock: "GetBucketPublicAccessBlock",
	GetBucketRequestPayment: "GetBucketRequestPayment",
	GetBucketTagging: "GetBucketTagging",
	GetBucketVersioning: "GetBucketVersioning",
	GetBucketWebsite: "GetBucketWebsite",
	GetEncryptionConfiguration: "GetEncryptionConfiguration",
	GetInventoryConfiguration: "GetInventoryConfiguration",
	GetIpConfiguration: "GetIpConfiguration",
	GetJob: "GetJob",
	GetLifecycleConfiguration: "GetLifecycleConfiguration",
	GetMetricsConfiguration: "GetMetricsConfiguration",
	GetObject: "GetObject",
	GetObjectAcl: "GetObjectAcl",
	GetObjectLegalHold: "GetObjectLegalHold",
	GetObjectRetention: "GetObjectRetention",
	GetObjectTagging: "GetObjectTagging",
	GetObjectTorrent: "GetObjectTorrent",
	GetObjectVersion: "GetObjectVersion",
	GetObjectVersionAcl: "GetObjectVersionAcl",
	GetObjectVersionTagging: "GetObjectVersionTagging",
	GetObjectVersionTorrent: "GetObjectVersionTorrent",
	GetReplicationConfiguration: "GetReplicationConfiguration",
	HeadBucket: "HeadBucket",
	ListAccessPoints: "ListAccessPoints",
	ListAll: "List*",
	ListBucket: "ListBucket",
	ListBucketMultipartUploads: "ListBucketMultipartUploads",
	ListBucketVersions: "ListBucketVersions",
	ListJobs: "ListJobs",
	ListMultipartUploadParts: "ListMultipartUploadParts",
	PutAccelerateConfiguration: "PutAccelerateConfiguration",
	PutAccessPointPolicy: "PutAccessPointPolicy",
	PutAccessPointPolicyStatus: "PutAccessPointPolicyStatus",
	PutAnalyticsConfiguration: "PutAnalyticsConfiguration",
	PutBucketAcl: "PutBucketAcl",
	PutBucketCORS: "PutBucketCORS",
	PutBucketLogging: "PutBucketLogging",
	PutBucketNotification: "PutBucketNotification",
	PutBucketObjectLockConfiguration: "PutBucketObjectLockConfiguration",
	PutBucketPolicy: "PutBucketPolicy",
	PutBucketPublicAccessBlock: "PutBucketPublicAccessBlock",
	PutBucketRequestPayment: "PutBucketRequestPayment",
	PutBucketTagging: "PutBucketTagging",
	PutBucketVersioning: "PutBucketVersioning",
	PutBucketWebsite: "PutBucketWebsite",
	PutEncryptionConfiguration: "PutEncryptionConfiguration",
	PutInventoryConfiguration: "PutInventoryConfiguration",
	PutIpConfiguration: "PutIpConfiguration",
	PutLifecycleConfiguration: "PutLifecycleConfiguration",
	PutMetricsConfiguration: "PutMetricsConfiguration",
	PutObject: "PutObject",
	PutObjectAcl: "PutObjectAcl",
	PutObjectLegalHold: "PutObjectLegalHold",
	PutObjectRetention: "PutObjectRetention",
	PutObjectTagging: "PutObjectTagging",
	PutObjectVersionAcl: "PutObjectVersionAcl",
	PutObjectVersionTagging: "PutObjectVersionTagging",
	PutReplicationConfiguration: "PutReplicationConfiguration",
	RestoreObject: "RestoreObject",
	SelectObjectContent: "SelectObjectContent",
	UpdateJobPriority: "UpdateJobPriority",
	UpdateJobStatus: "UpdateJobStatus",
	UploadPart: "UploadPart",
	UploadPartCopy: "UploadPartCopy",
};
