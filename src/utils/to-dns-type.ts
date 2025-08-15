import { DNSRecordType } from "../types.js";

/**
 * Converts a string representation of a DNS record type to the corresponding `DNSRecordType` enum value.
 * If the input string does not match any valid DNS record type, it returns `undefined`.
 *
 * @example
 * ```ts
 * import { toDnsType } from "diggy";
 * console.log(toDnsType("A")); // Output: "A"
 * console.log(toDnsType("MX")); // Output: "MX"
 * console.log(toDnsType("INVALID")); // Output: undefined
 * ```
 * @param type - The string representation of the DNS record type (e.g., "A", "AAAA", "MX").
 * @group Utilities
 */
export function toDnsType(type?: string): DNSRecordType | undefined {
	if (!type) return undefined;
	const typeUpper: string = type.toUpperCase();

	return Object.values(DNSRecordType).includes(typeUpper as DNSRecordType)
		? (typeUpper as DNSRecordType)
		: undefined;
}
