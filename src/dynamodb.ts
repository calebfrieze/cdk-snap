import { DynamoDbAction } from "./enums";

/**
 * @name CDKSnapDynamoDBAccessOptions
 * @description Options for configuring access to DynamoDB tables
 *
 * @param tableNames - List of DynamoDB table names
 * @param actions - Actions to either override or add to the default DynamoDB actions
 * @param overrideActions - Override default actions for DynamoDB access
 */
export interface CDKSnapDynamoDBAccessOptions {
	tableNames?: string[];
	actions?: (typeof DynamoDbAction)[keyof typeof DynamoDbAction][];
	overrideActions?: boolean;
}
