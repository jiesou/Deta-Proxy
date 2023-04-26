---
app_name: Proxy
tagline: Simple HTTP Network Proxy in Deta
---

Example:

```
https://xxxx-deta.app/https://example.com
```

Support for protocols that are not explicitly specified, example:

```
https://xxxx-deta.app/example.com
```
equals to
```
https://xxxx-deta.app/http://example.com
```

Supports forwarding headers, body (readable stream) and so on.
