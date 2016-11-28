require('jquery');
require('bootstrap');
require('bootstrap.css');
require('konva');
require('./stylesheets/main.css');

const {browserHistory, Router, Route, IndexRoute} = require('react-router');
const {deepOrange500} = require('material-ui/styles/colors');
const App = require('./components/App');
const Auth = require('./components/Auth');
const DebugSettings = require('./components/DebugSettings');
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;
const Help = require('./components/Help');
const Home = require('./components/Home');
const injectTapEventPlugin = require('react-tap-event-plugin');
const Login = require('./components/auth/Login');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const Plant = require('./components/plant/Plant');
const Plants = require('./components/plants/Plants');
const Privacy = require('./components/info/Privacy');
const Profile = require('./components/user/Profile');
const LayoutMap = require('./components/layout/LayoutMap');
const React = require('react');
const ReactDOM = require('react-dom');
const Terms = require('./components/info/Terms');

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

injectTapEventPlugin();

// TODO: Put a Not Found / No Match component in here.
var routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='/auth/token' component={Auth}/>
    <Route path='/debug-settings' component={DebugSettings}/>
    <Route path='/help' component={Help}/>
    <Route path='/layout/:slug/:id' component={LayoutMap}/>
    <Route path='/login' component={Login}/>
    <Route path='/plant' component={Plant}/>
    <Route path='/plant/:slug/:id' component={Plant}/>
    <Route path='/plants/:slug/:id' component={Plants}/>
    <Route path='/privacy' component={Privacy}/>
    <Route path='/profile' component={Profile}/>
    <Route path='/terms' component={Terms}/>
    <Route path='*' component={Help}/>
  </Route>
);

function render() {
  let content = document.createElement('div');
  content.className = 'wrapper'; // hang some styles on this top level el
  document.body.appendChild(content);

  ReactDOM.render((
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory}>{routes}</Router>
    </MuiThemeProvider>
  ), content);

}

function main() {
  render();
}

main();
