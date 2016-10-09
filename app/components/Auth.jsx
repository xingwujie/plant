const Base = require('./Base');
const React = require('react');
const store = require('../store');
const actions = require('../actions');
const Immutable = require('immutable');

class Auth extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.onChange);

    let { query } = this.props.location;

    var code = query && query.jwt;

    store.dispatch(actions.loginRequest(code));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    this.setState(store.getState().get('user', Immutable.Map()));
  }

  componentDidUpdate() {
    const jwt = store.getState().get('user', Immutable.Map()).get('jwt');
    if(jwt) {
      const returnurl = localStorage.getItem('returnurl');
      if(returnurl) {
        localStorage.removeItem('returnurl');
      }
      let destination = returnurl || '/';
      this.context.router.push(destination);
    } else {
      this.context.router.push('/login');
    }
  }

  render() {
    return (
      <Base>
          <h2>Authenticating...</h2>
      </Base>
    );
  }
};

Auth.propTypes = {
  location: React.PropTypes.object,
};

module.exports = Auth;
