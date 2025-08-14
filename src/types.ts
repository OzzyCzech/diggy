/**
 * Represents the type of DNS records that can be queried.
 *
 * @enum {string}
 * @property {string} A - IPv4 address record.
 * @property {string} AAAA - IPv6 address record.
 * @property {string} CAA - Certification Authority Authorization record.
 * @property {string} CNAME - Canonical Name record, used for aliasing one domain to another.
 * @property {string} NAPTR - Naming Authority Pointer record, used for service discovery.
 * @property {string} MX - Mail Exchange record, used for email routing.
 * @property {string} NS - Name Server record, indicating the authoritative DNS servers for a domain.
 * @property {string} PTR - Pointer record, used for reverse DNS lookups.
 * @property {string} SOA - Start of Authority record, providing information about the DNS zone.
 * @property {string} SRV - Service record, used to define the location of services.
 * @property {string} TXT - Text record, used for arbitrary text data, often for verification purposes.
 *
 * @group DNS Records
 */
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

/**
 * Represents the data for a DNS MX (Mail Exchange) record.
 * @property exchange - The mail server that will handle emails for the domain.
 * @property priority - The priority of the mail server, where lower values indicate higher priority.
 * @group DNS Records
 */
export type MxRecordData = { exchange: string; priority: number };

/**
 * Represents the data for a DNS SOA (Start of Authority) record.
 * @property nsname - The name server for the domain.
 * @property hostmaster - The email address of the domain administrator (formatted as a string with a dot instead of an '@').
 * @property serial - The serial number of the SOA record.
 * @property refresh - The time interval (in seconds) before the zone should be refreshed.
 * @property retry - The time interval (in seconds) before a retry should be attempted if the refresh fails.
 * @property expire - The time interval (in seconds) before the zone expires if it cannot be refreshed.
 * @property minttl - The minimum time-to-live (TTL) for the zone, indicating how long the record should be cached by resolvers.
 * @group DNS Records
 */
export type SoaRecordData = {
	nsname: string;
	hostmaster: string;
	serial: number;
	refresh: number;
	retry: number;
	expire: number;
	minttl: number;
};

/**
 * Represents the data for a DNS CAA (Certification Authority Authorization) record.
 * @property flags - The flags for the CAA record, indicating whether the record is critical or not.
 * @property tag - The tag for the CAA record, indicating the type of authorization (e.g., "issue", "issuewild", "iodef").
 * @property value - The value for the CAA record, which specifies the authorized certificate authority or other information.
 * @group DNS Records
 */
export type CaaRecordData = { flags: number; tag: string; value: string };

/**
 * Represents the data for a DNS NAPTR (Naming Authority Pointer) record.
 * @property order - The order of the NAPTR record, used to determine the sequence in which records should be processed.
 * @property preference - The preference of the NAPTR record, used to determine the order of preference among multiple records.
 * @property flags - The flags for the NAPTR record, which can indicate various properties (e.g., "U" for URI, "S" for service).
 * @property service - The service type for the NAPTR record, indicating the type of service provided (e.g., "SIP+D2U").
 * @property regexp - The regular expression for the NAPTR record, which can be used to transform the domain name.
 * @property replacement - The replacement string for the NAPTR record, which can be used to replace the domain name.
 * @group DNS Records
 */
export type NaptrRecordData = {
	order: number;
	preference: number;
	flags: string;
	service: string;
	regexp: string;
	replacement: string;
};

/**
 * Represents the data for a DNS SRV (Service) record.
 * @property priority - The priority of the SRV record, used to determine the order in which services should be used.
 * @property weight - The weight of the SRV record, used to distribute traffic among multiple services with the same priority.
 * @property port - The port number on which the service is running.
 * @property name - The target domain name of the service, which can be a hostname or an IP address.
 * @group DNS Records
 */
export type SrvRecordData = {
	priority: number;
	weight: number;
	port: number;
	name: string;
};

/**
 * @group DNS Records
 */
export type DNSRecord<T = string | string[]> = {
	name: string;
	type: DNSRecordType;
	ttl?: number;
	data: T;
};

/**
 * Represents any DNS record type, including A, AAAA, CAA, CNAME, NAPTR, MX, NS, PTR, SOA, SRV, and TXT records.
 * This type is a union of the generic DNSRecord type and specific record types like MxRecordData.
 * @group DNS Records
 */
export type AnyDNSRecord =
	| DNSRecord
	| DNSRecord<MxRecordData>
	| DNSRecord<SoaRecordData>
	| DNSRecord<CaaRecordData>
	| DNSRecord<NaptrRecordData>
	| DNSRecord<SrvRecordData>;
