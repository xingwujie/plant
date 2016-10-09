const {Link} = require('react-router');
const Base = require('./Base');
const React = require('react');
const store = require('../store');
const utils = require('../libs/utils');

const {makeSlug} = utils;

class Home extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();
  }

  updateState() {
    const users = store.getState().get('users');
    this.setState({users});
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);

    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    this.updateState();
  }

  renderUser(user) {
    const _id = user.get('_id');
    const userName = user.get('name');
    const link = `/plants/${makeSlug(userName)}/${_id}`;
    return (
      <div key={_id} style={{display: 'flex', alignItems: 'center'}}>
        <Link
          style={{margin: '20px'}}
          to={link}
        >
          <span>{userName}</span>
        </Link>
      </div>
    );
  }

  anonHome() {
    return (<div id='hero'>
      <div className='home-header'>Trees and Plants</div>
      <div className='home-subheader'>Increase your success through tracking</div>
      <div className='home-subheader'>
        <div><Link to={'/login'}>{'Login'}</Link>{' to get started'}</div>
      </div>
    </div>);
  }

  renderUsers() {
    const users = store.getState().get('users');
    if(users && users.size) {
      return users.valueSeq().toArray().map(user => this.renderUser(user));
    } else {
      return this.anonHome();
    }
  }

  render() {
    return (
      <Base>
        <div>
          {this.renderUsers()}
        </div>
      </Base>
    );
  }
}

module.exports = Home;
