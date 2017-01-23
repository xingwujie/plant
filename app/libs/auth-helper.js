
function isOwner(object, store) {
  const user = store.getState().get('user');

  const owner = user && user.get('jwt') && user.get('_id') && object &&
    // owner is true if no _id (creating) and user is logging in
    (object.userId === user.get('_id') || !object._id);
  return !!owner;
}

function isLoggedIn(store) {
  const user = store.getState().get('user');
  return !!(user && user.get('isLoggedIn'));
}

module.exports = {
  isLoggedIn,
  isOwner,
};
