import { CDKSnapApiResource } from "./restApi";

/**
 * Takes in a PascalCase string and returns a hyphenated string.
 */
export function pascalToHyphenated(str: string) {
	return str
		.replace(/\.?([A-Z]+)/g, (x, y) => "-" + y.toLowerCase())
		.replace(/^-/, "");
}

export const ResourceNameStyle = {
	DEFAULT: "default",
	HYPHENATED: "hyphenated",
};

/**
 * Takes in the name of the resource and returns the name of the resource
 * with the stage appended to it and the project name prepended to it.
 */
export interface ResourceNameOptions {
	style: (typeof ResourceNameStyle)[keyof typeof ResourceNameStyle];
}

export const createResourceName =
	(projectName: string) =>
	(
		name: string,
		{ style }: ResourceNameOptions = { style: ResourceNameStyle.DEFAULT }
	) => {
		switch (style) {
			case ResourceNameStyle.HYPHENATED:
				return `${pascalToHyphenated(projectName)}${
					name.length == 0 ? "" : `-${pascalToHyphenated(name)}`
				}-${process.env["STAGE"]}`;
			default:
				return `${projectName}${name.length == 0 ? "" : `-${name}`}-${
					process.env["STAGE"]
				}`;
		}
	};

export function mergeResources(
	...res: CDKSnapApiResource[][]
): CDKSnapApiResource[] {
	return res.reduce((acc, curr) => {
		curr.forEach((r2) => {
			let r1 = acc.find((r) => r.path === r2.path);
			if (r1) {
				r1.resources = r1.resources || [];
				r1.methods = r1.methods || [];
				r1.resources = mergeResources(...[r1.resources, r2.resources || []]);
				r1.methods = [...r1.methods, ...(r2.methods || [])];
			} else {
				acc.push(r2);
			}
		});
		return acc;
	}, []);
}
