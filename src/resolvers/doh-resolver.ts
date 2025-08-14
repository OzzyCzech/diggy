import type { AnyDNSRecord, DNSRecordType } from "../types";
import { toDnsRecord } from "../utils/to-dns-record";
import type { DNSResolver } from "./DNSResolver";

/**
 * Returns a DNS resolver that uses DNS over HTTPS (DoH) to resolve DNS records.
 *
 * ```ts
 * import { dohResolver } from "diggy";
 * const resolver = dohResolver("https://dns.google/resolve");
 * const records = await resolver("example.com", "A");
 * console.log(records);
 * ```
 *
 * > 💡 **Tip:** Find more public [DoH endpoints here](https://github.com/curl/curl/wiki/DNS-over-HTTPS)
 *
 * @param url - The URL of the DoH server to use (e.g., `https://dns.google/resolve`).
 * @group Resolvers
 */
export function dohResolver(url: string): DNSResolver {
	const dnsUrl = new URL(url);

	return async (host: string, type: DNSRecordType): Promise<AnyDNSRecord[]> => {
		dnsUrl.searchParams.set("name", host);
		dnsUrl.searchParams.set("type", type);

		const re = await fetch(dnsUrl, {
			headers: { accept: "application/dns-json" },
		});

		if (!re.ok) {
			throw new Error(
				`Error fetching DNS records for ${host}: ${re.status} ${re.statusText}`,
			);
		}

		const json = (await re.json()) as DNSJsonResponse;

		if (!Array.isArray(json.Answer)) return []; // No records found

		return json.Answer.map((record) => {
			return toDnsRecord({
				name: record.name,
				type: DNSTypeNumbers.get(record.type) ?? "UNKNOWN",
				ttl: record.TTL,
				data: record.data,
			});
		});
	};
}

type DNSJsonResponse = {
	Status: number;
	TC: boolean;
	RA: boolean;
	AD: boolean;
	CD: boolean;

	Question: Array<{
		name: string;
		type: number;
	}>;

	Authority?: Array<{
		name: string;
		type: number;
		TTL: number;
		data: string;
	}>;

	Answer?: Array<{
		name: string;
		type: number;
		TTL: number;
		data: string;
	}>;
	Comment?: string;
};

const DNSTypeNumbers = new Map<number, string>([
	[1, "A"],
	[2, "NS"],
	[5, "CNAME"],
	[6, "SOA"],
	[12, "PTR"],
	[15, "MX"],
	[16, "TXT"],
	[24, "SIG"],
	[25, "KEY"],
	[28, "AAAA"],
	[33, "SRV"],
	[35, "NAPTR"],
	[43, "DS"],
	[48, "DNSKEY"],
	[257, "CAA"],
]);
