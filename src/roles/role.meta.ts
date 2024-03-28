import { PolicyStatement, RoleProps } from "aws-cdk-lib/aws-iam";
import { CDKSnapResourceOptions } from "../resource";

/**
 * @name CDKSnapRoleOptions
 * @description Universal options for configuring IAM roles
 *
 * @param policyStatements - Custom policy statements to add to the role
 * @param props - Additional properties for the role
 * @param roleName - Name of the role
 * @param useStackName - Use the stack name in the role name
 */
export interface CDKSnapRoleOptions extends CDKSnapResourceOptions {
	policyStatements?: PolicyStatement[];
	props?: Partial<RoleProps>;
}

export function buildRoleName(
	useStackName: boolean,
	stack: any,
	roleName: string,
	defaultRoleName: string
) {
	return useStackName
		? stack.resourceName(roleName || defaultRoleName)
		: roleName || defaultRoleName;
}
