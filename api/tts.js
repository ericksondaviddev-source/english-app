export default async function handler(req, res) {
  const { text = '', lang = 'en' } = req.query;

  if (!text || text.length > 200) {
    res.status(400).json({ error: 'Invalid or too long text' });
    return;
  }

  const tl = lang === 'es' ? 'es' : 'en';
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${tl}&client=tw-ob`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream error ${upstream.status}` });
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(buffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
