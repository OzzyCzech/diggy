import { type AnyDNSRecord, DNSRecordType, type DNSResolver } from "../types";

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
