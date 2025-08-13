import { digResolver } from "./resolvers/dig-resolver";
import { dohResolver } from "./resolvers/doh-resolver";
import { nodeResolver } from "./resolvers/node-resolver";
import type { BuildInDNSResolver, DNSResolver } from "./types";

const resolvers: Record<BuildInDNSResolver, DNSResolver> = {
	nodejs: nodeResolver(),
	dig: digResolver(),
	google: dohResolver("https://dns.google/resolve"),
	cloudflare: dohResolver("https://cloudflare-dns.com/dns-query"),
};

export function getResolver(
	resolver?: string | BuildInDNSResolver | DNSResolver,
): DNSResolver {
	if (typeof resolver === "function") {
		return resolver;
	}

	if (typeof resolver === "string" && resolver in resolvers) {
		return resolvers[resolver as BuildInDNSResolver];
	}

	return resolvers.google;
}
