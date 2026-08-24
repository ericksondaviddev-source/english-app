export default async function handler(req, res) {
  const { text = '', sl = 'en', tl = 'es' } = req.query;

  if (!text || text.length > 500) {
    res.status(400).json({ error: 'Invalid or too long text' });
    return;
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl === 'es' ? 'es' : 'en'}&tl=${tl === 'en' ? 'en' : 'es'}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream error ${upstream.status}` });
      return;
    }

    const data = await upstream.json();
    const translation = data?.[0]?.map(item => item?.[0] || '').join('') || null;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).json({ translation });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
