import {Link} from 'react-router';
import React from 'react';

export default class Plant extends React.Component {

  constructor() {
    super();
  }

  render() {
    var {
      name, //eslint-disable-line no-shadow
      id,
      imageUrl
    } = this.props || {};

    const link = `/plant/${id}`;

    const style = {
      display: 'flex',
      flexDirection: 'row'
    };

    return (
      <Link
        className='plant-item'
        to={link} style={style}>
        <img src={imageUrl} />
        <div>{name}</div>
      </Link>
    );
  }
}
