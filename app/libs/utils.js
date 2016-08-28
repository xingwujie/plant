import slug from 'slug';

// bson is currently not being explicitly installed in the project because
// mongodb depends on mongodb-core which depends on bson. The Npm 3 installer
// will therefore install bson as a top level dependency in node_modules. If
// this pattern is changed then we would need to install npm independently.
// Requiring only bson here achieves 2 things:
// 1. Fixes a problem that Webpack has when bundling this module and chaining
//    from mongodb down to bson and,
// 2. Reduces the size of the bundle that gets generated for the browser.
import bson from 'bson';
const {ObjectID} = bson;

export function makeMongoId() {
  return new ObjectID().toString();
}

export function makeSlug(text) {
  if(!text) {
    console.warn('text is falsey in makeSlug:', text);
    return '';
  }

  text = text.toString();
  text = text.replace(/\//g, ' ');
  return slug(text.toString(), {
    // replacement: '-',
    // symbols: true,
    // remove: /[.]/g,
    lower: true,
    // charmap: slug.charmap,
    // multicharmap: slug.multicharmap
  });
}

export function makePlantsUrl(user = {}) {
  const {
    name: userName = '',
    _id = ''
  } = user;

  return `/plants/${makeSlug(userName)}/${_id}`;
}

// TODO: Move this file to a /shared/ folder.
