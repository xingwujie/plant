import _ from 'lodash';
import Base from './Base';
import Footer from './Footer';
import LoginStore from '../stores/LoginStore';
import React from 'react';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = LoginStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    LoginStore.listen(this.onChange);
  }

  componentWillUnmount() {
    LoginStore.unlisten(this.onChange);
  }

  onChange(user){
    this.setState(user);
  }

  userPlants() {
    // Fake a list of 10 plants
    return _.range(10).map((item) => {
      return (
        <div key={item} className='home-plant'>
          <a href={`/plant/${item}`}>{item}</a>
        </div>
      );
    });
  }

  anonHome() {
    return (<div id='hero'>
      <div className='home-header'>Fruit Trees and Plants</div>
      <div className='home-subheader'>Increase your success through tracking</div>
      <div className='home-subheader'>
        <div>Login to get started</div>
        <a href='/auth/facebook'>
          <img src='/img/facebook-login.png' />
        </a>
        </div>
    </div>);
  }

  render() {

    const displayName = _.get(this, 'state.user.name');

    return (
      <Base>
        <div className='home-content'>
          {displayName && this.userPlants()}
          {!displayName && this.anonHome()}
        </div>
        <Footer />
      </Base>
    );
  }
}
