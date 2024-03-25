import { Stack } from "aws-cdk-lib";
import { createResourceName } from ".";

export class CDKSnapStack extends Stack {
	resourceName(name: string) {
		return createResourceName(this.stackName)(name);
	}
}
