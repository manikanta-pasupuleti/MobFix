#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || process.env.PORT || 4200;
const baseDir = process.argv[3] || path.join(__dirname, '..', 'mobfix-frontend', 'dist', 'mobfix-frontend', 'browser');

const mime = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let fsPath = path.join(baseDir, urlPath);

    // if path is directory or ends with /, serve index.html
    if (fsPath.endsWith(path.sep) || fs.existsSync(fsPath) && fs.statSync(fsPath).isDirectory()) {
      fsPath = path.join(fsPath, 'index.html');
    }

    // If file doesn't exist, fallback to index.html (SPA)
    if (!fs.existsSync(fsPath)) {
      const index = path.join(baseDir, 'index.html');
      if (fs.existsSync(index)) return sendFile(res, index);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }

    sendFile(res, fsPath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server serving ${baseDir} on http://127.0.0.1:${port}`);
});
