const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const response = await fetch('https://victoryroad.pro/events/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const tournaments = [];

    $('table tbody tr').each((i, el) => {
      const row = $(el);
      const firstTd = row.find('td').first();

      const title = firstTd.find('a').text().trim();
      const href = firstTd.find('a').attr('href');
      const format = firstTd.find('span.has-small-font-size').text().trim();

      // Only include Reg G or I
      if (format && /regulation\s*[gi]/i.test(format) && href) {
        tournaments.push({
          title,
          format,
          url: href.startsWith('http') ? href : `https://victoryroad.pro${href}`
        });
      }
    });

    res.status(200).json({
      format: "Reg G + I",
      tournaments
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to scrape events list', details: err.message });
  }
}
