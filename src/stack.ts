import { Resource, Stack } from "aws-cdk-lib";
import { ResourceNameOptions, createResourceName } from ".";

export class CDKSnapStack extends Stack {
	constructor(scope: any, id: string, props?: any) {
		super(scope, id, props);
	}

	/**
	 * @name buildRoleName
	 * @description Build the role name based on the stack name and provided options.
	 *
	 * @param useStackName - Use the stack name in the role name
	 * @param defaultRoleName - Default role name
	 * @param roleName - Role name
	 */
	buildRoleName(
		useStackName: boolean,
		defaultRoleName: string,
		roleName?: string
	): string {
		return useStackName
			? this.resourceName(roleName || defaultRoleName)
			: roleName || defaultRoleName;
	}

	/**
	 * @name createDynamoDbResourceArns
	 * @description Create DynamoDB table ARNs
	 *
	 * @param resources - List of DynamoDB table arns
	 */
	createDynamoDbResourceArns = (resources: string[]): string[] =>
		resources.map((resource) => this.getDynamoDbArn(resource));

	/**
	 * @name createFirehoseResourceArns
	 * @description Create Firehose delivery stream ARNs
	 *
	 * @param resources	- List of Firehose delivery stream names
	 */
	createFirehoseResourceArns = (resources: string[]): string[] =>
		resources.map((resource) => this.getFirehoseArn(resource));
	/**
	 * @name createIamActions
	 * @description Create IAM actions for the provided resource
	 *
	 * @param resource - Resource name
	 * @param actions - List of actions
	 */
	createIamActions = (resource: string, actions: string[]): string[] =>
		actions.map((action) => `${resource}:${action}`);

	/**
	 * @name getDynamoDbArn
	 * @description Get the DynamoDB table ARN
	 *
	 * @param tableName - Name of the DynamoDB table
	 */
	getDynamoDbArn(tableName: string): string {
		return `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableName}`;
	}

	/**
	 * @name getFirehoseArn
	 * @description Get the Firehose delivery stream ARN
	 *
	 * @param deliveryStreamName
	 */
	getFirehoseArn(deliveryStreamName: string): string {
		return `arn:aws:firehose:${this.region}:${this.account}:deliverystream/${deliveryStreamName}`;
	}

	/**
	 * @name resourceName
	 * @description Create a resource name based on the stack name
	 *
	 * @param name
	 * @param options
	 */
	resourceName(name: string, options?: ResourceNameOptions): string {
		const [projectName] = this.stackName.split("-");
		return createResourceName(projectName)(name, options);
	}
}
