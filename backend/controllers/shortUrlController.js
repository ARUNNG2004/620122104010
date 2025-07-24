import { nanoid } from 'nanoid';
import geoip from 'geoip-lite';
import ShortUrl from '../models/ShortUrl.js';
import ClickStat from '../models/ClickStat.js';
import { isValidUrl } from '../utils/validateUrl.js';


export const createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid or missing URL.' });
    }

    const duration = Number.isInteger(validity) && validity > 0 ? validity : 30;
    const expiresAt = new Date(Date.now() + duration * 60 * 1000); // ms

    let finalCode = shortcode || nanoid(6);


    if (shortcode) {
      const exists = await ShortUrl.findOne({ shortCode: shortcode });
      if (exists) {
        return res.status(409).json({ error: 'Shortcode already exists.' });
      }
    } else {

      while (await ShortUrl.findOne({ shortCode: finalCode })) {
        finalCode = nanoid(6);
      }
    }

    const newShort = await ShortUrl.create({
      originalUrl: url,
      shortCode: finalCode,
      expiry: expiresAt,
    });

    return res.status(201).json({
      shortLink: `${req.protocol}://${req.get('host')}/${finalCode}`,
      expiry: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error('Create Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;

    const record = await ShortUrl.findOne({ shortCode: shortcode });

    if (!record) {
      return res.status(404).json({ error: 'Shortcode not found.' });
    }

    if (Date.now() > new Date(record.expiry).getTime()) {
      return res.status(410).json({ error: 'Short URL has expired.' });
    }


    const referrer = req.get('Referrer') || 'Direct';
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.ip ||
      'Unknown';

    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city || 'Unknown'}, ${geo.country}` : 'Unknown';

    await ClickStat.create({
      shortCode: shortcode,
      referrer,
      location,
    });

    await ShortUrl.updateOne({ shortCode: shortcode }, { $inc: { clicks: 1 } });

    return res.redirect(record.originalUrl);
  } catch (err) {
    console.error('Redirect Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getShortUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;

    const record = await ShortUrl.findOne({ shortCode: shortcode });
    if (!record) {
      return res.status(404).json({ error: 'Shortcode not found.' });
    }

    const clicks = await ClickStat.find({ shortCode: shortcode }).sort({ timestamp: -1 });

    return res.status(200).json({
      longUrl: record.originalUrl,
      createdAt: record.createdAt,
      expiry: record.expiry,
      clicks: record.clicks || 0,
      clickDetails: clicks.map((c) => ({
        timestamp: c.timestamp,
        referrer: c.referrer,
        location: c.location,
      })),
    });
  } catch (err) {
    console.error('Stats Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
