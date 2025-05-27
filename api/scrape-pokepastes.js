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

    // Get each link + player name
    const links = $('a[href*="pokepast.es"]');

    for (let i = 0; i < Math.min(links.length, 16); i++) {
      const el = links[i];
      const href = $(el).attr('href');

      // Try to find player name (assumes 2nd cell in the row is name)
      const row = $(el).closest('tr');
      const tds = row.find('td');
      const player = $(tds[1]).text().trim() || `Player ${i + 1}`;

      // Fetch Pokepaste content
      let paste = null;
      try {
        const pasteId = href.replace("https://pokepast.es/", "").replace(/\/+$/, '');
        const pasteRes = await fetch(`https://pokepast.es/${pasteId}/raw`);
        paste = await pasteRes.text();
      } catch (err) {
        paste = "Failed to load paste";
      }

      pokepastes.push({
        player,
        pokepaste_url: href,
        paste
      });
    }

    res.status(200).json({
      tournament: url,
      teams: pokepastes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape or fetch pastes', details: error.message });
  }
}
