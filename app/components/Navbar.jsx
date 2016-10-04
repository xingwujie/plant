const React = require('react');
const store = require('../store');
const actions = require('../actions');
const utils = require('../libs/utils');
const {isLoggedIn} = require('../libs/auth-helper');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const AddIcon = require('material-ui/svg-icons/content/add').default;

const {Link} = require('react-router');

class Navbar extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);
    const {user = {}} = store.getState().toJS();
    this.setState({user});
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    const {user = {}} = store.getState().toJS();
    this.setState({user});
  }

  logout() {
    store.dispatch(actions.logout());
  }

  render() {
    const {
      user = {}
    } = this.state || {};
    const displayName = user.name || '';

    const loggedIn = isLoggedIn();

    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#plant-navbar-collapse' aria-expanded='false'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar' />
              <span className='icon-bar' />
              <span className='icon-bar' />
            </button>
            <Link to={'/'} className='navbar-brand'>Plant</Link>
            {loggedIn &&
              <Link to={'/plant'}>
                <FloatingActionButton
                  title='Add Plant' mini={true} style={{marginTop: '5px'}}
                >
                  <AddIcon />
                </FloatingActionButton>
              </Link>
            }
          </div>

          <div className='collapse navbar-collapse' id='plant-navbar-collapse'>
            <ul className='nav navbar-nav navbar-right'>
              {loggedIn &&
                <li>
                  <Link to={utils.makePlantsUrl(user)} title='My Plants'>My Plants</Link>
                </li>
              }
              {loggedIn &&
                <li className='dropdown'>
                  <a href='#' className='dropdown-toggle'
                    data-toggle='dropdown' role='button'
                    aria-haspopup='true' aria-expanded='false'
                    title={displayName}>{displayName} <span className='caret' />
                  </a>
                  <ul className='dropdown-menu'>
                    <li>
                      <Link to={'/profile'}>Profile</Link>
                    </li>
                    <li>
                      <a href='#' onClick={this.logout} title='Logout'>Logout</a>
                    </li>
                  </ul>
                </li>
              }
              {!loggedIn &&
                <li>
                  <Link to='/login'>Login</Link>
                </li>
              }
              <li>
                <Link to={'/help'} title='help'>Help</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

module.exports = Navbar;
