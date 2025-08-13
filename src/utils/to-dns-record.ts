import {
	type AnyDNSRecord,
	DNSRecordType,
	type MxRecordData,
	type SoaRecordData,
} from "../types";

type InputData = string | string[];
type OutputData = string | string[] | MxRecordData | SoaRecordData;

function convertDataByType(type: DNSRecordType, data: InputData): OutputData {
	switch (type) {
		case DNSRecordType.SOA: {
			const parts = String(data).split(" ");
			if (parts.length < 7) {
				throw new Error("Invalid SOA record format");
			}

			return {
				nsname: (parts[0] ?? "").replace(/\.$/, ""),
				hostmaster: (parts[1] ?? "").replace(/\.$/, ""),
				serial: parseInt(parts[2] ?? "", 10),
				refresh: parseInt(parts[3] ?? "", 10),
				retry: parseInt(parts[4] ?? "", 10),
				expire: parseInt(parts[5] ?? "", 10),
				minttl: parseInt(parts[6] ?? "", 10),
			} as SoaRecordData;
		}

		case DNSRecordType.MX: {
			const mx = String(data).split(" ");
			if (mx.length < 2) {
				throw new Error("Invalid MX record format");
			}
			return {
				priority: parseInt(mx[0] ?? "", 10),
				exchange: mx.slice(1).join(" ").replace(/\.$/, ""),
			} as MxRecordData;
		}

		case DNSRecordType.TXT: {
			const txt = String(data) ?? "";

			// Cloudflare or dig returns TXT records as `"rec1" "rec2" "rec3 "` need to be parsed
			if (txt.startsWith('"') && txt.endsWith('"')) {
				const matches = txt.match(/"([^"]*)"/g);

				return matches
					? matches.map((part: string) => part.replace(/"/g, ""))
					: [];
			}
		}
	}

	return Array.isArray(data) ? data.join(" ") : data;
}

export function toDnsRecord({
	name,
	type,
	ttl,
	data,
}: {
	name: string;
	type: string;
	ttl?: number;
	data: InputData;
}): AnyDNSRecord {
	return {
		// remove trailing dot from name
		name: name.replace(/\.$/, ""),

		// ensure type is a valid DNSRecordType
		type: type as DNSRecordType,

		// default ttl to 0 if not provided
		ttl: ttl ?? 0,

		// convert data based on type
		data: convertDataByType(type as DNSRecordType, data),
	} as AnyDNSRecord;
}
