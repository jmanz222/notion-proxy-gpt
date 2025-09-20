export default async function handler(req, res) {
  try {
    const notionToken = process.env.NOTION_TOKEN;
    if (!notionToken) {
      res.status(500).json({ error: 'Missing NOTION_TOKEN environment variable' });
      return;
    }

    const notionApiBase = 'https://api.notion.com/v1';

    // Map /api/notion/... -> https://api.notion.com/v1/...
    const incomingPath = req.url.replace(/^\/api\/notion/, '');
    const targetUrl = notionApiBase + (incomingPath || '/');

    // Read body safely (Vercel provides parsed body if JSON; fall back if needed)
    const body =
      req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : typeof req.body === 'string'
        ? req.body
        : req.body
        ? JSON.stringify(req.body)
        : undefined;

    const notionRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body
    });

    const text = await notionRes.text();
    res.status(notionRes.status).setHeader('Content-Type', 'application/json').send(text);
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', details: String(err) });
  }
}
