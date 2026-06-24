import { describe, expect, it } from "vitest";

import {
	DatabaseError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
	isExpectedClientError,
} from "@leuchtturm/core/errors";

describe("isExpectedClientError", () => {
	it("treats handled 4xx client errors as expected", () => {
		expect(isExpectedClientError(UnauthorizedError.new())).toBe(true);
		expect(isExpectedClientError(ForbiddenError.new())).toBe(true);
		expect(isExpectedClientError(NotFoundError.new({ resource: "Document" }))).toBe(true);
		expect(isExpectedClientError(new ValidationError({}))).toBe(true);
	});

	it("does not treat server-side defects as expected", () => {
		expect(isExpectedClientError(DatabaseError.new({ operation: "Query" }))).toBe(false);
		expect(isExpectedClientError(InternalServerError.new())).toBe(false);
	});

	it("does not treat arbitrary values as expected", () => {
		expect(isExpectedClientError(new Error("boom"))).toBe(false);
		expect(isExpectedClientError({ _tag: "UnauthorizedError" })).toBe(false);
		expect(isExpectedClientError(undefined)).toBe(false);
		expect(isExpectedClientError(null)).toBe(false);
	});
});
