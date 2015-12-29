// Purpose: Keep localStorage up-to-date with changes in the user object.

// 1. Listen to state changes.
// 2. If the user object has changed then write to localStorage

let user;
export function setupSubscribe(store) {
  let currentValue = user;

  function select(state) {
    return state.user;
  }

  function handleChange() {
    let previousValue = currentValue;
    currentValue = select(store.getState());

    if (previousValue !== currentValue) {
      console.log('Changing user obj in localStorage to:', currentValue);
      localStorage.setItem('user', JSON.stringify(currentValue));
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
      user = {};
    }
  }

  return user;
}
