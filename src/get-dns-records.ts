import { type BuildInDNSResolver, getResolver } from "./get-resolver.js";
import type { DNSResolver } from "./resolvers/DNSResolver.js";
import type { AnyDNSRecord, DNSRecordType } from "./types.js";
import { resolveAllRecords } from "./utils/resolve-all-records.js";
import { toDnsType } from "./utils/to-dns-type.js";

/**
 * Fetches DNS records for a given `host` and type. When no `type` is specified,
 * it retrieves all available DNS records for the host.
 *
 * @example Fetch all DNS records for a host
 * ```ts
 * import { getDnsRecords } from "diggy";
 * const records = await getDnsRecords("example.com");
 * console.log(records);
 * ```
 *
 * @example Get A records for a host
 * ```ts
 * import { getDnsRecords } from "diggy";
 * const aRecords = await getDnsRecords("example.com", "A");
 * console.log(aRecords);
 * ```
 *
 * @example Change the DNS resolver (built-in resolvers)
 * ```ts
 * import { getDnsRecords } from "diggy";
 * const records = await getDnsRecords("example.com", "A", "google");
 * console.log(records);
 * ```
 *
 * @example Use Node.js DNS resolver
 * ```ts
 * import { getDnsRecords } from "diggy";
 * const records = await getDnsRecords("example.com", "A", "nodejs");
 * console.log(records);
 * ```
 *
 * @example Use a custom DNS resolver
 * ```ts
 * import { getDnsRecords } from "diggy";
 * import { customResolver } from "./my-custom-resolver";
 * const records = await getDnsRecords("example.com", "A", customResolver);
 * console.log(records);
 * ```
 *
 * @param host - The domain or host for which to fetch DNS records e.g. "example.com".
 * @param type - The type of DNS record to fetch (e.g., "A", "AAAA", "MX"). If not specified, all records will be fetched.
 * @param resolver - The DNS resolver to use. It can be a built-in resolver name (like "google" or "cloudflare"), a custom resolver function, or a string URL for a DoH resolver.
 * @group Main Functions
 */
export function getDnsRecords(
	host: string,
	type?: string,
	resolver?: string | BuildInDNSResolver | DNSResolver,
): Promise<AnyDNSRecord[]> {
	const dnsResolver = getResolver(resolver);
	const dnsType: DNSRecordType | undefined = toDnsType(type);

	return dnsType
		? dnsResolver(host, dnsType)
		: resolveAllRecords(host, dnsResolver);
}
