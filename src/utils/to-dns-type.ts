import { DNSRecordType } from "../types";

export function toDnsType(type?: string): DNSRecordType | undefined {
	if (!type) return undefined;
	const typeUpper: string = type.toUpperCase();

	return Object.values(DNSRecordType).includes(typeUpper as DNSRecordType)
		? (typeUpper as DNSRecordType)
		: undefined;
}
