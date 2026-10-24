const { URL } = require('node:url');

function createApp() {
  const notes = [];

  return async function app(req, res) {
    const url = new URL(req.url, 'http://localhost');

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (url.pathname !== '/notes') {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    if (req.method === 'GET') {
      res.statusCode = 200;
      res.end(JSON.stringify(notes));
      return;
    }

    if (req.method === 'POST') {
      let body = '';

      for await (const chunk of req) {
        body += chunk;
      }

      let data;
      try {
        data = JSON.parse(body || '{}');
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      if (typeof data.text !== 'string' || data.text.trim() === '') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'text is required' }));
        return;
      }

      const note = { id: notes.length + 1, text: data.text.trim() };
      notes.push(note);
      res.statusCode = 201;
      res.end(JSON.stringify(note));
      return;
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  };
}

module.exports = { createApp };