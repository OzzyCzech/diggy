import { describe, expect, it } from "vitest";
import {
	BuildInDNSResolver,
	type DNSRecordType,
	getResolver,
} from "../src/index.js";

describe("getResolver", () => {
	it("should return default resolver", async () => {
		const resolver = getResolver();

		expect(typeof resolver).toBe("function");
		expect(resolver.length).toBe(2);

		const result = await resolver("google.com", "A" as DNSRecordType);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty("name", "google.com");
		expect(result[0]).toHaveProperty("type", "A");
		expect(result[0]).toHaveProperty("ttl", expect.any(Number));
		expect(result[0]).toHaveProperty("data", expect.any(String));
	});

	it("should return nodejs resolver", async () => {
		const resolver = getResolver(BuildInDNSResolver.nodejs);

		expect(typeof resolver).toBe("function");
		expect(resolver.length).toBe(2);

		const result = await resolver("google.com", "A" as DNSRecordType);

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty("name", "google.com");
		expect(result[0]).toHaveProperty("type", "A");
		expect(result[0]).toHaveProperty("ttl", expect.any(Number));
		expect(result[0]).toHaveProperty("data", expect.any(String));
	});
});
