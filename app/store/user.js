// Purpose: Keep localStorage up-to-date with changes in the user object.

// 1. Listen to state changes.
// 2. If the user object has changed then write to localStorage
const Immutable = require('immutable');

let user;
export function setupSubscribe(store) {
  let currentValue = user;

  function handleChange() {
    let previousValue = currentValue;
    currentValue = store.getState().get('user');

    if (!previousValue.equals(currentValue)) {
      localStorage.setItem('user', JSON.stringify(currentValue.toJS()));
    }
  }

  // let unsubscribe = store.subscribe(handleChange);
  // Will not need to unsubscribe until app shuts down.
  store.subscribe(handleChange);
}

export function initialState() {
  if(!user) {
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch(e) {
    }
    user = user || {};
  }

  return Immutable.fromJS(user);
}
