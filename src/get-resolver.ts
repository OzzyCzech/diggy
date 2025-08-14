import type { DNSResolver } from "./resolvers/DNSResolver";
import { digResolver } from "./resolvers/dig-resolver";
import { dohResolver } from "./resolvers/doh-resolver";
import { nodeResolver } from "./resolvers/node-resolver";

/**
 * Represents the built-in DNS resolvers available in the library.
 * @enum {string}
 * @property {string} nodejs - Uses Node.js's built-in DNS resolver.
 * @property {string} dig - Uses the `dig` command-line tool for DNS resolution.
 * @property {string} google - Uses Google's DNS over HTTPS (DoH) resolver.
 * @property {string} cloudflare - Uses Cloudflare's DNS over HTTPS (DoH) resolver.
 * @group Resolvers
 */
export enum BuildInDNSResolver {
	nodejs = "nodejs",
	dig = "dig",
	google = "google",
	cloudflare = "cloudflare",
}

const resolvers: Record<BuildInDNSResolver, DNSResolver> = {
	nodejs: nodeResolver(),
	dig: digResolver(),
	google: dohResolver("https://dns.google/resolve"),
	cloudflare: dohResolver("https://cloudflare-dns.com/dns-query"),
};

/**
 * Returns a DNS resolver function based on the provided resolver name or function.
 *
 * If a `string` is provided, it must match one of the built-in resolvers.
 * If a `function` is provided, it will be returned as is.
 * If no resolver is provided, the default resolver (Google's DoH) will be used
 *
 * @example
 * ```ts
 * import { getResolver } from "diggy";
 * const resolver = getResolver("google"); // Returns the Google DoH resolver
 * ```
 *
 *
 * @param {string | BuildInDNSResolver | DNSResolver} [resolver] - The name of the built-in resolver or a custom resolver function.
 * @return {DNSResolver} The DNS resolver function.
 * @group Main Functions
 */
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
