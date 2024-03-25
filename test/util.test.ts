import {
	pascalToHyphenated,
	createResourceName,
	ResourceNameStyle,
} from "../src/util"; // replace 'util' with the actual file name

const STAGE = "test";

describe("pascalToHyphenated", () => {
	it("should convert PascalCase to hyphenated", () => {
		expect(pascalToHyphenated("TestString")).toBe("test-string");
		expect(pascalToHyphenated("AnotherTestString")).toBe("another-test-string");
		expect(pascalToHyphenated("YetAnotherTestString")).toBe(
			"yet-another-test-string"
		);
	});
});

describe("createResourceName", () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		// Store the original process.env
		originalEnv = process.env;
		// Mock process.env
		process.env = { ...originalEnv, STAGE };
	});

	afterEach(() => {
		// Restore the original process.env
		process.env = originalEnv;
	});
	it("should prepend the project name and append the stage to the resource name", () => {
		const resourceName = createResourceName("TestProject")("TestResource", {
			style: ResourceNameStyle.DEFAULT,
		});
		expect(resourceName).toBe(`TestProjectTestResource-${STAGE}`);
	});

	it("should convert the resource name to hyphenated if the style is HYPHENATED", () => {
		const resourceName = createResourceName("TestProject")("TestResource", {
			style: ResourceNameStyle.HYPHENATED,
		});
		expect(resourceName).toBe(`test-project-test-resource-${STAGE}`);
	});
});
