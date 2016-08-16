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
  return slug(text.toLowerCase());
}
