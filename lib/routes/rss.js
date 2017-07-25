const mongo = require('../db/mongo');
const slug = require('slugify');

module.exports = (app) => {

  // Set up the RSS route
  app.get('/rss', (req, res) => {
    const http_host = req.protocol+'://'+req.get('host'); // React can't help here!!

    mongo.getNotesLatest(20, (err, notes) => {
      if(err) return res.status(500).send({ success: false, message: 'RSS error' });

      return res.status(200).send(build_xml(notes, http_host));
    });
  });
}

function build_xml(notes, http_host){
  let xml = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'+
    '<channel><title>Latest Notes</title>'+
    '<atom:link href="'+http_host+'/rss" rel="self" type="application/rss+xml" />'+
    '<language>en-us</language>'+
    '<link>'+http_host+'</link>'+
    '<description>Plant progress.</description>';

  notes.map( (curr_note) => {
    let desc = (curr_note.note ? curr_note.note : '(no comment)'); // patch for empty

    // If multiple plants, just list the name of the first one
    let plant_name = curr_note.plants[0].title;
    if(curr_note.plants.length > 1) plant_name += ' (+ '+(curr_note.plants.length - 1)+' others)';

    // Turn the date into a pubDate able format
    let d = curr_note.date.toString();
    //~ let s = Date.parse(d.slice(0, 4)+'-'+d.slice(4, 6)+'-'+d.slice(6)); // preferred format but....
    let s = Date.parse(d.slice(4, 6)+'-'+d.slice(6)+'-'+d.slice(0, 4)); // timezone fix

    // Create the link URL with note ID. This will also make it unique for GUID
    let sl = slug(curr_note.plants[0].title.toLowerCase().replace(/[/()]/g, ' '));
    let uri = http_host+'/plant/'+sl+'/'+curr_note.plantIds[0]+'#'+curr_note._id; // just the first

    // Append images. RSS spec wants a full https|http given.
    if(curr_note.images && curr_note.images.length > 0)
      curr_note.images.map( (img) => { desc += '<img src="https://i.plaaant.com/up/orig/'+img.id+'.'+img.ext+'" />'; });

    xml += '<item>'+
        '<title>'+plant_name+'</title>'+
        '<description><![CDATA['+desc+']]></description>'+
        '<pubDate>'+new Date(s).toUTCString()+'</pubDate>'+
        '<guid>'+uri+'</guid>'+
        '<link>'+uri+'</link>'+
      '</item>';
  });

  // Finish feed, serve warm
  xml += '</channel></rss>';

  return xml;
}
