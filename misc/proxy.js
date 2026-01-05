const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
const net = require('net');

const PORT = 24051;
const TOSU_PORT = 24050;
const TOSU_CHECK_INTERVAL = 5000;

let tokenCache = {
  accessToken: null,
  expiresAt: 0,
  clientId: null,
  clientSecret: null
};

let tosuCheckInterval = null;
let tosuWasRunning = false;

const logPath = path.join(process.cwd(), 'proxy.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  try {
    fs.appendFileSync(logPath, logMessage);
  } catch (err) {
  }
}

function checkTosuRunning() {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(1000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(TOSU_PORT, '127.0.0.1');
  });
}

async function startTosuMonitoring() {
  log('Starting tosu monitoring...');
  
  const isRunning = await checkTosuRunning();
  tosuWasRunning = isRunning;
  
  if (isRunning) {
    log('tosu detected - proxy will auto-shutdown when tosu closes');
  } else {
    log('tosu not detected yet - waiting for tosu to start...');
  }
  
  tosuCheckInterval = setInterval(async () => {
    const isRunning = await checkTosuRunning();
    
    if (!isRunning && tosuWasRunning) {
      log('tosu has stopped - shutting down proxy...');
      shutdown('TOSU_CLOSED');
    } else if (isRunning && !tosuWasRunning) {
      log('tosu detected - proxy will auto-shutdown when tosu closes');
      tosuWasRunning = true;
    }
    
    tosuWasRunning = isRunning;
  }, TOSU_CHECK_INTERVAL);
}

function stopTosuMonitoring() {
  if (tosuCheckInterval) {
    clearInterval(tosuCheckInterval);
    tosuCheckInterval = null;
  }
}

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function getOsuToken(clientId, clientSecret) {
  if (tokenCache.accessToken && 
      Date.now() < tokenCache.expiresAt &&
      tokenCache.clientId === clientId &&
      tokenCache.clientSecret === clientSecret) {
    return tokenCache.accessToken;
  }

  const postData = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'public'
  });

  const options = {
    hostname: 'osu.ppy.sh',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Accept': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, postData);
    
    if (response.status === 200) {
      tokenCache.accessToken = response.data.access_token;
      tokenCache.expiresAt = Date.now() + (response.data.expires_in - 300) * 1000;
      tokenCache.clientId = clientId;
      tokenCache.clientSecret = clientSecret;
      log('OAuth token obtained successfully');
      return tokenCache.accessToken;
    } else {
      log(`Failed to get token: ${response.status}`);
      return null;
    }
  } catch (error) {
    log(`Error getting token: ${error.message}`);
    return null;
  }
}

async function makeOsuApiRequest(endpoint, token) {
  const options = {
    hostname: 'osu.ppy.sh',
    port: 443,
    path: `/api/v2${endpoint}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options);
    return { status: response.status, data: response.data };
  } catch (error) {
    log(`API request error: ${error.message}`);
    return { status: 500, data: { error: error.message } };
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-ID, X-Client-Secret');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      port: PORT,
      version: '1.0.0',
      uptime: process.uptime(),
      tosuRunning: tosuWasRunning
    }));
    return;
  }

  if (pathname === '/api') {
    const clientId = req.headers['x-client-id'];
    const clientSecret = req.headers['x-client-secret'];
    const endpoint = parsedUrl.query.endpoint;

    if (!clientId || !clientSecret) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing credentials' }));
      return;
    }

    if (!endpoint) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing endpoint parameter' }));
      return;
    }

    const token = await getOsuToken(clientId, clientSecret);
    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get OAuth token - check credentials' }));
      return;
    }

    const result = await makeOsuApiRequest(endpoint, token);
    
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`ERROR: Port ${PORT} is already in use!`);
    log('Please close any other instances of this proxy or change the port.');
    process.exit(1);
  } else {
    log(`Server error: ${err.message}`);
    process.exit(1);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  log('='.repeat(60));
  log('osu! API Proxy Server');
  log('='.repeat(60));
  log(`Server running on: http://127.0.0.1:${PORT}`);
  log(`Health check: http://127.0.0.1:${PORT}/health`);
  log(`Log file: ${logPath}`);
  log('');
  log('This proxy will automatically shut down when tosu closes');
  log('Press Ctrl+C to stop the server manually');
  log('='.repeat(60));
  
  startTosuMonitoring();
});

function shutdown(signal) {
  log(`\n${signal} received - shutting down gracefully...`);
  
  stopTosuMonitoring();
  
  server.close(() => {
    log('Server closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    log('Forcing shutdown...');
    process.exit(1);
  }, 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.message}`);
  log(err.stack);
  stopTosuMonitoring();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  stopTosuMonitoring();
  process.exit(1);
});