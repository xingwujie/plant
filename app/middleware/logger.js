const logger = store => next => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.info('next state (immutable)', store.getState());
  console.info('next state (json)', store.getState().toJS());
  console.groupEnd(action.type);
  return result;
};

module.exports = logger;
