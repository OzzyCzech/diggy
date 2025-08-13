import { digResolver } from "./resolvers/dig-resolver";
import { dnsJsonOverHttps } from "./resolvers/dns-json-over-https";
import { nodeResolver } from "./resolvers/node-resolver";
import type { BuildInResolvers, DNSResolver } from "./types";

const resolvers: Record<BuildInResolvers, DNSResolver> = {
	nodejs: nodeResolver(),
	dig: digResolver(),
	google: dnsJsonOverHttps("https://dns.google/resolve"),
	cloudflare: dnsJsonOverHttps("https://cloudflare-dns.com/dns-query"),
};

export function getResolver(
	resolver?: string | BuildInResolvers | DNSResolver,
): DNSResolver {
	if (typeof resolver === "function") {
		return resolver;
	}

	if (typeof resolver === "string" && resolver in resolvers) {
		return resolvers[resolver as BuildInResolvers];
	}

	return resolvers.google;
}
