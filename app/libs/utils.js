import uuid from 'node-uuid';

export function makeCouchId() {
  return uuid.v4().replace(/-/g, '');
}
