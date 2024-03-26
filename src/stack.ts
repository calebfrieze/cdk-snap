import { Resource, Stack } from "aws-cdk-lib";
import { ResourceNameOptions, createResourceName } from ".";

export class CDKSnapStack extends Stack {
	constructor(scope: any, id: string, props?: any) {
		super(scope, id, props);
		if (!id.includes("-")) {
			throw new Error(
				"Stack name must be in the format of 'ProjectName-stage'."
			);
		}
	}

	resourceName(name: string, options?: ResourceNameOptions) {
		const [projectName] = this.stackName.split("-");
		return createResourceName(projectName)(name, options);
	}

	getDynamoDbArn(tableName: string) {
		return `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableName}`;
	}
	getFirehoseArn(deliveryStreamName: string) {
		return `arn:aws:firehose:${this.region}:${this.account}:deliverystream/${deliveryStreamName}`;
	}
	createDynamoDbResourceArns = (resources: string[]) =>
		resources.map((resource) => this.getDynamoDbArn(resource));
	createFirehoseResourceArns = (resources: string[]) =>
		resources.map((resource) => this.getFirehoseArn(resource));
	createIamActions = (resource: string, actions: string[]) =>
		actions.map((action) => `${resource}:${action}`);
}
