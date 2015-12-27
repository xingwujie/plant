// Purpose: Keep localStorage up-to-date with changes in the user object.

// 1. Listen to state changes.
// 2. If the user object has changed then write to localStorage

export function setupSubscribe(store) {
  let currentValue;

  function select(state) {
    return state.user;
  }

  function handleChange() {
    let previousValue = currentValue;
    currentValue = select(store.getState());

    if (previousValue !== currentValue) {
      console.log('Changing user obj in localStorage to:', currentValue);
      localStorage.setItem('user', currentValue);
    }
  }

  // let unsubscribe = store.subscribe(handleChange);
  // Will not need to unsubscribe until app shuts down.
  store.subscribe(handleChange);
}

export function initialState() {
  let user = localStorage.getItem('user') || {};
  console.log('Getting initial state for user obj from localStorage:', user);
  return user;
}
