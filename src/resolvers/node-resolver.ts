import type {
	AnyRecord,
	CaaRecord,
	MxRecord,
	NaptrRecord,
	RecordWithTtl,
	SrvRecord,
	TlsaRecord,
} from "node:dns";
import * as _dns from "node:dns/promises";
import { type AnyDNSRecord, DNSRecordType } from "../types.js";
import { isBrowser, isServerRuntime } from "../utils/detect.js";
import type { DNSResolver } from "./DNSResolver.js";

/**
 * Returns a DNS resolver that uses Node.js's built-in DNS module.
 *
 * @example
 * Without any additional configuration, it will use the system's default DNS servers.
 *
 *  ```ts
 * import { nodeResolver } from "diggy";
 * const resolver = nodeResolver();
 * const records = await resolver("example.com", "A");
 * ```
 *
 * @example
 * You can specify a list of DNS servers to use.
 *
 * ```ts
 * import { nodeResolver } from "diggy";
 * const resolver = nodeResolver(["8.8.8.8", "1.1.1.1"]);
 * const records = await resolver("example.com", "A");
 * ```
 *
 * @param servers - An array of DNS server addresses to use. If empty, the system's default DNS servers will be used.
 * @group Resolvers
 */
export function nodeResolver(servers: string[] = []): DNSResolver {
	let dns: _dns.Resolver | null = null;

	if (isServerRuntime()) {
		dns = new _dns.Resolver();
		if (servers.length > 0) {
			dns.setServers(servers);
		}
	}

	return async (host: string, type: DNSRecordType): Promise<AnyDNSRecord[]> => {
		if (isBrowser() || !dns) {
			throw new Error("nodeResolver cannot be used in a browser environment");
		}

		try {
			// Handle special cases for A and AAAA records to include TTL
			if (type === DNSRecordType.A || type === DNSRecordType.AAAA) {
				const records: RecordWithTtl[] =
					type === DNSRecordType.A
						? await dns.resolve4(host, { ttl: true })
						: await dns.resolve6(host, { ttl: true });

				return records.map(({ address, ttl }) => ({
					name: host,
					type: type,
					ttl: ttl,
					data: address,
				}));
			}

			// Handle SOA (is not an array)
			if (type === DNSRecordType.SOA) {
				const record = await dns.resolveSoa(host);
				return [
					{
						name: host,
						type: type,
						data: record,
					},
				];
			}

			// Handle CAA, MX, NAPTR, NS, PTR, SRV, TXT (all return arrays)
			const records = (await dns.resolve(host, type)) as
				| string[]
				| CaaRecord[]
				| MxRecord[]
				| NaptrRecord[]
				| SrvRecord[]
				| TlsaRecord[]
				| string[][]
				| AnyRecord[];

			return records.map(
				(
					record:
						| string
						| CaaRecord
						| MxRecord
						| NaptrRecord
						| SrvRecord
						| TlsaRecord
						| string[]
						| AnyRecord,
				) =>
					({
						name: host,
						type: type,
						data: Array.isArray(record) ? record.join(" ") : record,
					}) as AnyDNSRecord,
			);
		} catch {
			return [];
		}
	};
}
