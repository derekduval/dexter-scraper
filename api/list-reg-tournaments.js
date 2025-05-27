const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const response = await fetch('https://victoryroad.pro/events/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const tournaments = [];

    $('table tbody tr').each((i, el) => {
      const td = $(el).find('td').first();
      const link = td.find('a').attr('href');
      const title = td.find('a').text().trim();
      const format = td.find('span').text().trim();

      if (link && /regulation\s*[gi]/i.test(format)) {
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
    res.status(500).json({ error: 'Scrape failed', details: err.message });
  }
}
