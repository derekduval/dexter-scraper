const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const response = await fetch('https://victoryroad.pro/events/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const tournaments = [];

    $('.wp-block-table table tbody tr').each((i, el) => {
      const titleCell = $(el).find('td').first();
      const title = titleCell.find('a').text().trim();
      const link = titleCell.find('a').attr('href');
      const format = titleCell.find('span').text().trim();

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
