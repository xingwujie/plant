const mongo = require('../db/mongo');
const slug = require('slugify');


function buildXml(notes, httpHost) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel><title>Latest Notes</title>
    <atom:link href="${httpHost}/rss" rel="self" type="application/rssxml" />
    <language>en-us</language>
    <link>${httpHost}/rss</link>
    <description>Plant progress.</description>`;

  notes.map((currNote) => {
    let desc = (currNote.note ? currNote.note : '(no comment)'); // patch for empty

    // If multiple plants, just list the name of the first one
    let plantName = currNote.plants[0].title;
    if (currNote.plants.length > 1) plantName += ` (+ ${(currNote.plants.length - 1)} others)`;

    // Turn the date into a pubDate able format
    const d = currNote.date.toString();
    // let s = Date.parse(d.slice(0, 4)+'-'+d.slice(4, 6)+'-'+d.slice(6));
    const s = Date.parse(`${d.slice(4, 6)}-${d.slice(6)}-${d.slice(0, 4)}`); // timezone fix

    // Create the link URL with note ID. This will also make it unique for GUID
    const sl = slug(currNote.plants[0].title.toLowerCase().replace(/[/()]/g, ' '));
    const uri = `${httpHost}/plant/${sl}/${currNote.plantIds[0]}#${currNote._id}`; // just the first

    // Append images. RSS spec wants a full https|http given.
    if (currNote.images && currNote.images.length > 0) {
      currNote.images.map((img) => {
        desc += `<img src="https://i.plaaant.com/up/orig/${img.id}.${img.ext}" />`;
        return true;
      });
    }

    xml += `<item>
        <title>${plantName}</title>
        <description><![CDATA[${desc}]]></description>
        <pubDate>${new Date(s).toUTCString()}</pubDate>
        <guid>${uri}</guid>
        <link>${uri}</link>
      </item>`;

    return true;
  });

  // Finish feed, serve warm
  xml += '</channel></rss>';

  return xml;
}

module.exports = (app) => {
  //
  // Set up the RSS route
  app.get('/rss', (req, res) => {
    const httpHost = `${req.protocol}://${req.get('host')}`;

    mongo.getNotesLatest(20, (err, notes) => {
      if (err) return res.status(500).send({ success: false, message: 'RSS error' });

      return res.status(200).send(buildXml(notes, httpHost));
    });
  });
};
