const indexHtml = require('.');
const React = require('react');
const { createStore } = require('redux');
const { Provider } = require('react-redux');
const appReducers = require('../../app/reducers');
// const App = require('../../app/components/App');
const Plant = require('../../app/components/plant/Plant');
const { renderToString } = require('react-dom/server');
const singlePlant = require('../db/single-plant');
const Immutable = require('immutable');
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const {deepOrange500} = require('material-ui/styles/colors');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;

const target = (req, res) => {
  const {
    user = {},
    params = {},
  } = req;
  const {id: plantId = ''} = params;

  if(!plantId) {
    return res.send(indexHtml());
  }

  const muiTheme = getMuiTheme({
    palette: {
      accent1Color: deepOrange500,
    },
    userAgent: req.headers['user-agent'],
  });

  singlePlant(user, plantId, (singlePlantErr, initialState) => {
    if(singlePlantErr) {
      // Need Logging? Prbably not - should be in DB code.
      res.send(indexHtml());
    } else {
      // Create a new Redux store instance
      const store = createStore(appReducers, Immutable.fromJS(initialState));

      // Render the component to a string
      const html = renderToString(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Provider store={store}>
            <Plant params={params}/>
          </Provider>
        </MuiThemeProvider>
      );

      const plant = initialState.plants[plantId] || {};

      // Grab the initial state from our Redux store
      // const initialState = store.getState();

      const data = {
        html,
        initialState,
        title: plant.title || 'Plaaant',
      };
      res.send(indexHtml(data));
    }
  });
};

// const current = (req, res) => {
//   res.send(indexHtml());
// };

module.exports = target;

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
