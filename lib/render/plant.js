const indexHtml = require('.');
const React = require('react');
const { createStore } = require('redux');
const { Provider } = require('react-redux');
const appReducers = require('../../app/reducers');
const App = require('../../app/components/App');
const { renderToString } = require('react-dom/server');

// eslint-disable-next-line no-unused-vars
const target = (req, res) => {
  // Create a new Redux store instance
  const store = createStore(appReducers);

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Grab the initial state from our Redux store
  const initialState = store.getState();

  const data = {
    html,
    initialState,
    title: 'Plaaant',
  };
  res.send(indexHtml(data));
};

const current = (req, res) => {
  res.send(indexHtml());
};

module.exports = current;

/*
Load:

Users
Locations
Plant
Notes

Final state:

intrim: {}
locations: { id1: {}, id2: {}, ...}
notes: { id1: {}, id2: {}, ...}
plants: { id1: {}}
user: {} - if logged in
users: { id1: {}, id2: {}, ...}

*/
