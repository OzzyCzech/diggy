export type DNSResolver = (
	host: string,
	type: DNSRecordType,
) => Promise<AnyDNSRecord[]>;

export type BuildInResolvers = "nodejs" | "dig" | "google" | "cloudflare";

export enum DNSRecordType {
	A = "A",
	AAAA = "AAAA",
	CAA = "CAA",
	CNAME = "CNAME",
	NAPTR = "NAPTR",
	MX = "MX",
	NS = "NS",
	PTR = "PTR",
	SOA = "SOA",
	SRV = "SRV",
	TXT = "TXT",
}

export type MxRecordData = { exchange: string; priority: number };

export type SoaRecordData = {
	nsname: string;
	hostmaster: string;
	serial: number;
	refresh: number;
	retry: number;
	expire: number;
	minttl: number;
};

export type CaaRecordData = { flags: number; tag: string; value: string };

export type NaptrRecordData = {
	order: number;
	preference: number;
	flags: string;
	service: string;
	regexp: string;
	replacement: string;
};

export type SrvRecordData = {
	priority: number;
	weight: number;
	port: number;
	name: string;
};

export type DNSRecord<T = string | string[]> = {
	name: string;
	type: DNSRecordType;
	ttl?: number;
	data: T;
};

export type AnyDNSRecord =
	| DNSRecord
	| DNSRecord<MxRecordData>
	| DNSRecord<SoaRecordData>
	| DNSRecord<CaaRecordData>
	| DNSRecord<NaptrRecordData>
	| DNSRecord<SrvRecordData>;
