export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://pokepast.es/')) {
    return res.status(400).json({ error: 'Missing or invalid Pokepaste URL' });
  }

  try {
    const id = url.replace('https://pokepast.es/', '').replace('.txt', '');
    const txtUrl = `https://pokepast.es/${id}.txt`;
    const response = await fetch(txtUrl);

    if (!response.ok) {
      return res.status(404).json({ error: 'Pokepaste not found' });
    }

    const data = await response.text();
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
