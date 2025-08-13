# Diggy

**Diggy** is a multi-backend JavaScript **DNS resolver** for fetching DNS records in multiple ways.  
It supports:

- DNS over HTTPS (DoH)
- The native [`dig`](https://linux.die.net/man/1/dig) command
- The built-in [Node.js `dns` module](https://nodejs.org/api/dns.html)

With Diggy, you can easily retrieve a variety of DNS record types for any domain — including **A**, **AAAA**, **SOA**,
**CNAME**, **TXT**, **MX**, and more.

## Installation

```bash
npm install diggy
```

## Usage

```javascript
import { getDnsRecords } from 'diggy';

// Fetch all DNS records for a domain
const allRecords = await getDnsRecords('example.com');
console.log(allRecords);

// Fetch only A records
const aRecords = await getDnsRecords('example.com', 'A');
console.log(aRecords);

// Fetch only TXT records
const aRecords = await getDnsRecords('example.com', 'TXT');
console.log(aRecords);
```

## 📜 Response Format

| Property | Type   | Description                                                      |
|----------|--------|------------------------------------------------------------------|
| `type`   | string | The DNS record type (e.g., A, AAAA, SOA, CNAME, TXT, MX, etc.)   |
| `name`   | string | The domain name associated with the record                       |
| `data`   | string | The record value (string or array of strings, depending on type) |
| `ttl`    | number | Time-to-live in seconds                                          |

## 🔧 Changing the Resolver

By default, Diggy uses [Google DNS JSON Over HTTPS](https://dns.google/resolve?name=ozana.cz&type=A). You can use a
custom resolver by passing it as the third argument to `getDnsRecords`.

```javascript
import { getDnsRecords, dnsJsonOverHttps } from 'diggy';

const myResolver = dnsJsonOverHttps("https://custom.json.dns/resolve");
const txtRecords = await getDnsRecords('example.com', "TXT", myResolver);
```

💡 A list of publicly available DNS resolvers is available at: https://public-dns.info/.
