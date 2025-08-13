# Diggy

**Diggy** is a multi-backend JavaScript **DNS resolver** library for fetching DNS records using DNS over HTTPS (DoH),
the `dig` command, or native [Node.js DNS](https://nodejs.org/api/dns.html) module.

You can retrieve various types of DNS records for a given domain, such as A, AAAA, SOA, CNAME, TXT, MX, and more.

## Installation

```bash
npm install diggy
```

## Usage

```javascript
import { getDnsRecords } from 'diggy';

const allRecords = await getDnsRecords('example.com');
console.log(allRecords);

const aRecords = await getDnsRecords('example.com', 'A');
console.log(aRecords);

const aRecords = await getDnsRecords('example.com', 'TXT');
console.log(aRecords);
```

The response will be an `array` of DNS records, each containing the following properties:

- `type`: The type of DNS record (e.g., A, AAAA, SOA, CA, TXT, MX, etc.)
- `name`: The name of the DNS record (e.g., the domain name)
- `data`: The value of the DNS record mostly is a string, can be an array of strings for some specific type
- `ttl`: The time-to-live of the DNS record in seconds

## Change resolver

The default DNS resolver is [Google DNS JSON Over HTTPS](https://dns.google/resolve?name=ozana.cz&type=A). You can
specify a custom resolver URL by passing it as the third argument to the `getDnsRecords` function.

```javascript
import { getDnsRecords } from 'diggy';

const myResolver = dnsJsonOverHttps("https://custom.json.dns/resolve");

const txtRecords = await getDnsRecords('example.com', "TXT", myResolver);
```

A list of publicly available DNS resolvers can be found at https://public-dns.info/.
