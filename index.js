// Load modules
import http from 'http';
import fetch from 'node-fetch';
import minimist from 'minimist';

// In-memory cache (key: path, value: { body, headers })
const cache = {};

// Parse command-line arguments
const args = minimist(process.argv.slice(2));

// Handle --clear-cache
if (args['clear-cache']) {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('✅ Cache cleared.');
  process.exit(0);
}

// Required: --port and --origin
const port = args.port;
const origin = args.origin;

if (!port || !origin) {
  console.error('❌ Please provide both --port and --origin');
  process.exit(1);
}

console.log(`🚀 Caching proxy server running on port ${port}`);
console.log(`🌐 Forwarding requests to: ${origin}`);

// Create the server
const server = http.createServer(async (req, res) => {
  const path = req.url;
  const fullUrl = `${origin}${path}`;

  // If cached
  if (cache[path]) {
    const cached = cache[path];
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Cache');

    res.writeHead(200, { ...cached.headers, 'X-Cache': 'HIT' });
    res.end(cached.body);
    return;
  }

  // Not cached: fetch from origin
  try {
    const response = await fetch(fullUrl);
    const body = await response.text(); // get body as text
    const headers = {};

    // Copy headers from the response
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Cache the result
    cache[path] = { body, headers };

    res.writeHead(response.status, { ...headers, 'X-Cache': 'MISS' });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error fetching from origin: ' + error.message);
  }
});

server.listen(port);
