# Diggy

**Diggy** is multi-backend JavaScript **DNS resolver** for fetching **DNS records** with flexible backend support.

## Features

- ✨ Multiple DNS backends - Choose the resolver that works best for your environment
- 🌐 DNS over HTTPS (DoH) - Secure DNS queries over encrypted connections
- ⚡ Native [dig command](https://linux.die.net/man/1/dig) - Leverage system DNS tools called from Node.js
- 🔧 Node.js [DNS module](https://nodejs.org/api/dns.html) - Use built-in Node.js DNS functionality
- 📋 Complete record support - Fetch **A**, **AAAA**, **SOA**, **CNAME**, **TXT**, **MX**, and [more](./src/types.ts)
- 🎯 TypeScript ready - Full type definitions included

## Installation

```bash
npm install diggy
```

## Quick Start

```javascript
import { getDnsRecords } from 'diggy';

// Fetch all DNS records for a domain
const allRecords = await getDnsRecords('example.com');
console.log(allRecords);

// Fetch specific record types
const aRecords = await getDnsRecords('example.com', 'A');
const txtRecords = await getDnsRecords('example.com', 'TXT');
const mxRecords = await getDnsRecords('example.com', 'MX');
```

### Available Build-in Resolvers

Diggy supports multiple DNS resolution backends. You can specify the resolver as the third argument:

```javascript
// Use Google DNS JSON Over HTTPS
const allRecords = await getDnsRecords('example.com', undefined, "google");

// Use Cloudflare DNS JSON Over HTTPS
const allRecords = await getDnsRecords('example.com', undefined, "cloudflare");

// Use nodejs dns module
const allRecords = await getDnsRecords('example.com', undefined, "nodejs");

// Use dig command
const allRecords = await getDnsRecords('example.com', undefined, "dig");
```

#### 🔧 Create Custom Resolver

By default, Diggy uses [Google DNS JSON Over HTTPS](https://dns.google/resolve?name=ozana.cz&type=A). You can use a
custom resolver by passing it as the third argument to `getDnsRecords`.

```javascript
import { getDnsRecords, dnsJsonOverHttps } from 'diggy';

const myResolver = dnsJsonOverHttps("https://custom.json.dns/resolve");
const txtRecords = await getDnsRecords('example.com', "TXT", myResolver);
```

Your resolver must implement the same interface as the built-in resolvers.

```typescript
export type DNSResolver = (
	host: string,
	type: DNSRecordType,
) => Promise<AnyDNSRecord[]>;
```

💡 A list of publicly available DNS resolvers is available at: https://public-dns.info/.

## 📜 Response Format

```typescript
import { CaaRecordData, MxRecordData, SoaRecordData, SrvRecordData } from "./types";
import { NaptrRecord } from "node:dns";

interface DnsRecord {
	name: string;    // Domain name
	type: string;    // Record type (A, AAAA, MX, etc.)
	ttl: number;     // Time-to-live in seconds

	// Record data (format varies by type)
	data:
		| string
		| string[]
		| MxRecordData
		| SoaRecordData
		| CaaRecordData
		| NaptrRecord
		| SrvRecordData;
}
```

Responses are returned as an array of objects, each representing a DNS record.

```json
[
	{
		"name": "example.com",
		"type": "SOA",
		"ttl": 3600,
		"data": {
			"nsname": "ns1.example.com.",
			"hostmaster": "hostmaster.example.com.",
			"serial": 2025051204,
			"refresh": 10800,
			"retry": 3600,
			"expire": 604800,
			"minttl": 3600
		}
	},
	{
		"name": "example.cz",
		"type": "A",
		"ttl": 1800,
		"data": "66.33.66.33"
	},
	{
		"name": "example.cz",
		"type": "MX",
		"ttl": 60,
		"data": {
			"priority": 10,
			"exchange": "mail.example.com"
		}
	}
]
```

## License

[MIT](/LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request