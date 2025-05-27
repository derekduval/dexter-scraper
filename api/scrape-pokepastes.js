// api/scrape-pokepastes.js
const cheerio = require('cheerio');

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const pokepastes = [];

    $('a[href*="pokepast.es"]').each((_, el) => {
      const href = $(el).attr('href');
      const player = $(el).closest('tr').find('td').first().text().trim() || "Unknown";
      pokepastes.push({ player, pokepaste_url: href });
    });

    res.status(200).json({
      tournament: url,
      teams: pokepastes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape page', details: error.message });
  }
}

