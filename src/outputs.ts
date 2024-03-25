import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

interface Output {
	name: string;
	value: string;
	description: string;
}

interface CreateOutputsOptions {
	outputs: Output[];
}

export const createOutputs = (
	stack: Construct,
	{ outputs }: CreateOutputsOptions
) => {
	for (const output of outputs) {
		new CfnOutput(stack, output.name, {
			value: output.value,
			description: output.description,
		});
	}
};
