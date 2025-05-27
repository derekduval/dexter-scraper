const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const response = await fetch('https://victoryroad.pro/events/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const tournaments = [];

    $('table tbody tr').each((i, el) => {
      const cell = $(el).find('td').first();

      const title = cell.find('a').text().trim();
      const href = cell.find('a').attr('href');
      const format = cell.find('span').text().trim();

      // Ensure link exists and format matches Reg G or I
      if (href && /regulation\s*[gi]/i.test(format)) {
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
