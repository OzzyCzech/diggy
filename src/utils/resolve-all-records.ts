import type { DNSResolver } from "../resolvers/DNSResolver";
import { type AnyDNSRecord, DNSRecordType } from "../types";

/**
 * Resolves all DNS records for a given host using the specified resolver.
 * This function attempts to resolve all types of DNS records defined in `DNSRecordType`.
 * If a record type cannot be resolved, it will be skipped.
 *
 * @param host - The domain or host for which to resolve DNS records (e.g., "example.com").
 * @param resolver - The DNS resolver function to use. It should accept a host and a DNS record type,
 * @group Utilities
 */
export async function resolveAllRecords(
	host: string,
	resolver: DNSResolver,
): Promise<AnyDNSRecord[]> {
	const allTypes = Object.values(DNSRecordType);
	const records = await Promise.allSettled(
		allTypes.map((t) => resolver(host, t as DNSRecordType)),
	);

	return records
		.filter((record) => record.status === "fulfilled")
		.flatMap((record) => record.value);
}
