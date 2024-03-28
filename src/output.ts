import { CfnOutput } from "aws-cdk-lib";
import { CDKSnapStack } from ".";

/**
 * @name CDKSnapOutput
 * @description Output properties for the stack.
 *
 * @param name - Name of the output
 * @param value - Value of the output
 * @param description - Description of the output
 */
export interface CDKSnapOutput {
	name: string;
	value: string;
	description: string;
}

/**
 * @name CreateOutputsOptions
 * @description Options for creating outputs for the stack.
 *
 * @param outputs - List of outputs to create
 */
export interface CreateOutputsOptions {
	outputs: CDKSnapOutput[];
}

export const createOutputs = (
	stack: CDKSnapStack,
	{ outputs }: CreateOutputsOptions
) => {
	for (const output of outputs) {
		new CfnOutput(stack, output.name, {
			value: output.value,
			description: output.description,
			exportName: `${output.name}-${process.env["STAGE"]}`,
		});
	}
};
