import type { AnyDNSRecord, DNSRecordType, DNSResolver } from "../types";
import { toDnsRecord } from "../utils/to-dns-record";

export function digResolver(server?: string): DNSResolver {
	return async (host: string, type: DNSRecordType): Promise<AnyDNSRecord[]> => {
		const args = [];

		if (server) {
			if (!server.startsWith("@")) {
				server = `@${server}`;
			}
			args.push(server);
		}

		args.push(host, type);

		const { spawnSync } = await import("node:child_process");

		// Use spawnSync to run the dig command synchronously and capture the output
		const dig = spawnSync("dig", [...args, "+noall", "+answer", "+cdflag"]);
		const results = dig.stdout.toString();

		const records: AnyDNSRecord[] = [];

		// split lines & ignore comments or empty lines
		results
			.split("\n")
			.filter((line) => line.length && !line.startsWith(";"))
			.forEach((line) => {
				const parts = line.replace(/\t+/g, " ").split(" ");

				records.push(
					toDnsRecord({
						name: parts[0] ?? "",
						ttl: Number(parts[1]),
						type: parts[3] as DNSRecordType,
						data: parts.slice(4).join(" "),
					}),
				);
			});

		return records;
	};
}
