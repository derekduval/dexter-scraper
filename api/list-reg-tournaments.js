const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const response = await fetch('https://victoryroad.pro/events/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const tournaments = [];

    $('.wp-block-table table tbody tr').each((i, el) => {
      const columns = $(el).find('td');
      const title = $(columns[0]).text().trim();
      const format = $(columns[1]).text().trim();
      const link = $(columns[0]).find('a').attr('href');

      if (/regulation\s*[gi]/i.test(format)) {
        tournaments.push({
          title,
          format,
          url: link.startsWith('http') ? link : `https://victoryroad.pro${link}`
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
