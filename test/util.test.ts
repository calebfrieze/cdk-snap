import {
	createResourceName,
	pascalToHyphenated,
	ResourceNameStyle,
} from "../src/util"; // replace './util' with the actual file path

describe("pascalToHyphenated", () => {
	it("should convert a PascalCase string to a hyphenated string", () => {
		const result = pascalToHyphenated("TestString");
		expect(result).toBe("test-string");
	});
});

describe("createResourceName", () => {
	it("should create a resource name with the default style", () => {
		const resourceName = createResourceName("TestProject")("TestResource");
		expect(resourceName).toBe(
			`TestProject-TestResource-${process.env["STAGE"]}`
		);
	});

	it("should create a resource name with the hyphenated style", () => {
		const resourceName = createResourceName("TestProject")("TestResource", {
			style: ResourceNameStyle.HYPHENATED,
		});
		expect(resourceName).toBe(
			`test-project-test-resource-${process.env["STAGE"]}`
		);
	});
});
