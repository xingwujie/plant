const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.info('next state', store.getState().toJS());
  console.groupEnd(action.type);
  return result;
};

module.exports = logger;
