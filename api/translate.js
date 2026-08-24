async function tryFetch(url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': '*/*',
        ...headers
      },
      signal: controller.signal
    });
    if (!resp.ok) return null;
    return resp;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  const { text = '', sl = 'en', tl = 'es' } = req.query;

  if (!text || text.length > 500) {
    res.status(400).json({ error: 'Invalid or too long text' });
    return;
  }

  const source = sl === 'es' ? 'es' : 'en';
  const target = tl === 'en' ? 'en' : 'es';
  const q = encodeURIComponent(text);

  // Provider 1: Google Chrome-extension endpoint (more permissive than translate_a)
  let r = await tryFetch(`https://clients5.google.com/translate_a/single?client=dict-chrome-ex&sl=${source}&tl=${target}&dt=t&q=${q}`);
  if (r) {
    try {
      const data = await r.json();
      const translation = data?.[0]?.map(item => item?.[0] || '').join('') || null;
      if (translation) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).json({ translation, provider: 'google' });
        return;
      }
    } catch { /* fall through */ }
  }

  // Provider 2: MyMemory (free, anonymous)
  r = await tryFetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=${source}|${target}`);
  if (r) {
    try {
      const data = await r.json();
      const translation = data?.responseData?.translatedText || null;
      if (translation && data?.responseStatus === 200) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).json({ translation, provider: 'mymemory' });
        return;
      }
    } catch { /* fall through */ }
  }

  res.status(502).json({ error: 'All translation providers failed' });
}
