import slug from 'slug';
import uuid from 'uuid';

export function makeMongoId() {
  return uuid.v4().replace(/-/g, '').slice(0, -8);
}

// TODO: Replace this with a module to make slugs
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
