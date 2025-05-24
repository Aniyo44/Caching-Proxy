# Caching Proxy Server

A simple CLI caching proxy server built with Node.js that forwards requests to an origin server, caches responses, and serves cached data on repeated requests.

---

## Dependencies

- node-fetch
- minimist

---

## Installation

```bash
npm install

```
## Usage 
```bash

node index.js --port <PORT> --origin <ORIGIN_URL>
```

exmaple :
```bash
 node index.js --port 3000 --origin http://dummyjson.com

```
check :
http://localhost:3000/products 
or curl :
```bash
curl -i http://localhost:3000/products

```

example output 
first time :
```bash
HTTP/1.1 200 OK
Content-Type: application/json
X-Cache: MISS
...
```
second request:
```bash
HTTP/1.1 200 OK
Content-Type: application/json
X-Cache: HIT
...
```

clear cache 
```bash
node index.js --clear-cache

```

