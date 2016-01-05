import store from '../store';

export function isOwner(object) {
  const {user} = store.getState();

  const owner = user && user.jwt && user._id && object &&
    // owner is true if no _id (creating) and user is logging in
    (object.userId === user._id || !object._id);
  if(!owner) {
    console.log('!owner isOwner object:', object);
    console.log('!owner isOwner user:', user);
    console.log('Stack:', Error().stack);
  }
  return owner;
}

export function isLoggedIn() {
  const {user} = store.getState();
  return user && user.isLoggedIn;
}
