export default async function handler(req, res) {
  const notionToken = process.env.NOTION_TOKEN;
  const notionApiBase = 'https://api.notion.com/v1';

  const targetPath = req.url.replace('/api/notion', '');
  const notionUrl = notionApiBase + targetPath;

  try {
    const notionRes = await fetch(notionUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
    });

    const data = await notionRes.text();
    res.status(notionRes.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
