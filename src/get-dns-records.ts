import { getResolver } from "./get-resolver";
import type {
	AnyDNSRecord,
	BuildInResolvers,
	DNSRecordType,
	DNSResolver,
} from "./types";
import { resolveAllRecords } from "./utils/resolve-all-records";
import { toDnsType } from "./utils/to-dns-type";

export function getDnsRecords(
	host: string,
	type?: string,
	resolver?: string | BuildInResolvers | DNSResolver,
): Promise<AnyDNSRecord[]> {
	const dnsResolver = getResolver(resolver);
	const dnsType: DNSRecordType | undefined = toDnsType(type);

	return dnsType
		? dnsResolver(host, dnsType)
		: resolveAllRecords(host, dnsResolver);
}
