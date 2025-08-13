# Diggy

## Usage

```javascript
import { getDnsRecords } from 'diggy';

const allRecords = await getDnsRecords('example.com');
console.log(allRecords);
```

The response will be an `array` of DNS records, each containing the following properties:

- `type`: The type of DNS record (e.g., A, AAAA, SOA, CA, CNAME, MX, etc.)
- `name`: The name of the DNS record
- `data`: The value of the DNS record
- `ttl`: The time-to-live of the DNS record in seconds