// File: api/proxy.js
export default async function handler(req, res) {
    // Replace with your Hetzner server's IP and the port your Node backend is running on
    const backendUrl = `http://178.156.148.182:3000${req.url}`;
  
    try {
      // Forward the request method, headers, and body (if applicable)
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      });
  
      // Read the response from the backend
      const data = await response.text();
  
      // Pass along the response status and headers
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
  
      res.send(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Proxy error' });
    }
  }
  