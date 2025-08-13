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
import { type AnyDNSRecord, DNSRecordType, type DNSResolver } from "../types";

export function nodeResolver(
	servers: string[] = ["1.1.1.1", "8.8.8.8"],
): DNSResolver {
	const dns = new _dns.Resolver();
	dns.setServers(servers);

	return async (host: string, type: DNSRecordType): Promise<AnyDNSRecord[]> => {
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
