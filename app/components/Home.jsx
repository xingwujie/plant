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
    return (<div></div>);
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
