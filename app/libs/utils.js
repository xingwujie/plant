import slug from 'slug';
import uuid from 'uuid';

export function makeCouchId() {
  return uuid.v4().replace(/-/g, '');
}

export function makeSlug(text) {
  if(!text) {
    console.warn('text is falsey in makeSlug:', text);
    return '';
  }

  text = text.toString();
  return slug(text.toLowerCase());
}
