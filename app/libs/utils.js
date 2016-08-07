import slug from 'slug';
import uuid from 'uuid';

export function makeCouchId() {
  return uuid.v4().replace(/-/g, '');
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
