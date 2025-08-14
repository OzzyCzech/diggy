import type { AnyDNSRecord, DNSRecordType } from "../types";

/**
 * DNSResolver is a function type that takes a host and a DNS record type,
 * and returns a promise that resolves to an array of DNS records.
 * It is used to fetch DNS records for a given host and type.
 *
 * @param host - The domain or host for which to fetch DNS records (e.g., "example.com").
 * @param type - The type of DNS record to fetch (e.g., "A", "AAAA", "MX").
 * @group Resolvers
 */
export type DNSResolver = (
	host: string,
	type: DNSRecordType,
) => Promise<AnyDNSRecord[]>;
