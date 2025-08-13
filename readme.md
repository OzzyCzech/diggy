# 👾 Diggy

👾 **Diggy** is a flexible, multi-backend JavaScript **DNS resolver** for fetching **DNS records**
with support for various resolution methods including DNS over HTTPS, native `dig` commands, and Node.js built-in DNS
functionality.

## Features

- **✨ Multiple DNS backends** - Choose from Google DoH, Cloudflare DoH, Node.js DNS, or native dig command or even
  create your own custom resolver!
- **🔒 DNS over HTTPS (DoH)** - Secure DNS queries over encrypted connections
- **⚡ Native dig Support** - Leverage system [DNS tools](https://linux.die.net/man/1/dig) directly from Node.js
- **🛠️ Node.js Integration** - Use built-in Node.js [DNS functionality](https://nodejs.org/api/dns.html)
- **📋 Complete Record Support** - Fetch A, AAAA, SOA, CNAME, TXT, MX, SRV, CAA, NAPTR, and more
- **🚀 Zero Dependencies** - Lightweight with literally no external dependencies
- **🎯 TypeScript ready** - Full type definitions included

## 📦 Installation

```bash
npm install diggy
```

```bash
yarn add diggy
```

```bash
pnpm add diggy
```

```bash
bun add diggy
```

## 🚀 Quick Start

### Basic Usage

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

### TypeScript Support

```typescript
import { type AnyDNSRecord, getDnsRecords } from 'diggy';

const records: AnyDNSRecord[] = await getDnsRecords('example.com', 'A');
```

```typescript
function getDnsRecords(
	host: string,
	type?: string,
	resolver?: string | BuildInDNSResolver | DNSResolver,
): Promise<AnyDNSRecord[]>
```

**Parameters:**

- `host` (string): The domain name to query
- `type` (string, optional): DNS record type (A, AAAA, MX, TXT, etc.). If omitted, returns all available records
- `resolver` (string | BuildInDNSResolver | DNSResolver, optional): DNS resolver to use

**Returns:** Promise resolving to an array of DNS records

## 🌍 Browser Usage

You can also use Diggy in the browser via ESM imports. This allows you to fetch DNS records directly from client-side
JavaScript. There are built-in resolvers for Google and Cloudflare DNS over HTTPS, which work seamlessly in the browser.

```html

<script type="module">
	import { getDnsRecords } from 'https://esm.sh/diggy';
	
	const records = await getDnsRecords('ozana.cz');
</script>
```

## 🌐 Available Resolvers

### Built-in Resolvers

Diggy includes several pre-configured resolvers:

```javascript
// Use Google DNS JSON Over HTTPS
const records = await getDnsRecords('example.com', 'A', "google");

// Use Cloudflare DNS JSON Over HTTPS
const records = await getDnsRecords('example.com', 'A', "cloudflare");

// Use nodejs dns module
const records = await getDnsRecords('example.com', 'A', "nodejs");

// Use dig command
const records = await getDnsRecords('example.com', 'A', "dig");
```

| Resolver     | Description                 | Environment                       | 
|--------------|-----------------------------|-----------------------------------|
| `google`     | Google DNS over HTTPS       | Browsers, Node.js                 | 
| `cloudflare` | Cloudflare DNS over HTTPS   | Browsers, Node.js                 | 
| `nodejs`     | Node.js built-in DNS module | Node.js only                      | 
| `dig`        | Native dig command          | Node.js, requires `dig` installed | 

### Configure built-in resolvers

Create your own DNS resolver for custom endpoints:

```javascript
import { getDnsRecords, dohResolver } from 'diggy';

const customDohResolver = dohResolver("https://custom.dns.provider/resolve");
const records = await getDnsRecords('example.com', 'TXT', customDohResolver);
```

> 💡 **Tip:** Find more public [DoH endpoints here](https://github.com/curl/curl/wiki/DNS-over-HTTPS)

Just like with `dohResolver`, you can also use `digResolver` or `nodeResolver` and specify a custom DNS server:

```javascript
import { getDnsRecords, digResolver, nodeResolver } from 'diggy';

// Native nodejs dns resolver witg specific DNS server
const customNodejsResolver = nodeResolver(['8.8.8.8']);
const records = await getDnsRecords('example.com', 'A', customNodejsResolver);

// Native dig command with specific DNS server
const customDigResolver = digResolver('1.1.1.1');
const records = await getDnsRecords('example.com', 'A', customDigResolver);
```

> 💡 **Tip:** Find more public [DNS servers here](https://public-dns.info/)

You can also **create your own custom resolver** by implementing the `DNSResolver` interface:

```typescript
export type DNSResolver = (
	host: string,
	type: DNSRecordType,
) => Promise<AnyDNSRecord[]>;
```

## 📝 Supported Record Types

| Type  | Description            | Example Use Case        |
|-------|------------------------|-------------------------|
| A     | IPv4 address           | Website hosting         |
| AAAA  | IPv6 address           | IPv6 connectivity       |
| CNAME | Canonical name         | Domain aliases          |
| MX    | Mail exchange          | Email routing           |
| TXT   | Text records           | SPF, DKIM, verification |
| SOA   | Start of authority     | Zone information        |
| SRV   | Service records        | Service discovery       |
| CAA   | Certificate authority  | SSL/TLS security        |
| NAPTR | Name authority pointer | ENUM, SIP routing       |

## 📜 Response Format

DNS records are returned as an array of objects with the following structure:

```typescript
import { CaaRecordData, MxRecordData, SoaRecordData, SrvRecordData, NaptrRecordData } from "./types";

interface AnyDNSRecord {
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
		| NaptrRecordData
		| SrvRecordData;
}
```

### Example Response

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

## 🔧 Requirements

- **Node.js**: Version 14 or higher
- **dig command**: Required only when using the 'dig' resolver
- **Internet connection**: Required for DoH resolvers (google, cloudflare)

## 📄 License

[MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

--- 

Made with ❤️ by the [Roman Ožana](https://ozana.cz)