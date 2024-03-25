import { Stack } from "aws-cdk-lib";
import { createResourceName } from ".";

export class CDKSnapStack extends Stack {
	resourceName(name: string) {
		return createResourceName(this.stackName)(name);
	}

	getDynamoDbArn(tableName: string) {
		return `arn:aws:dynamodb:${this.region}:${this.account}:table/${tableName}`;
	}
	createDynamoDbResourceArns = (resources: string[]) =>
		resources.map((resource) => this.getDynamoDbArn(resource));
	createIamActions = (actions: string[], resource: string) =>
		actions.map((action) => `${resource}:${action}`);
}
