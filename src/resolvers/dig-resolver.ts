import type { AnyDNSRecord, DNSRecordType } from "../types.js";
import { toDnsRecord } from "../utils/to-dns-record.js";
import type { DNSResolver } from "./DNSResolver.js";

/**
 * Returns a DNS resolver that uses the `dig` command to resolve DNS records.
 *
 * ```ts
 * import { digResolver } from "diggy";
 * const resolver = digResolver();
 * const records = await resolver("example.com", "A");
 * console.log(records);
 * ```
 *
 * You can also specify the DNS server to use by passing it as an argument:
 *
 * ```ts
 * import { digResolver } from "diggy";
 * const resolver = digResolver("1.1.1.1");
 * const records = await resolver("example.com", "A");
 * console.log(records);
 *```
 *
 * @param server - The DNS server to use (optional). If not provided, the default system resolver will be used.
 * @group Resolvers
 */
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
