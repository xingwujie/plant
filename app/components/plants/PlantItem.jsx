// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
import {Link} from 'react-router';
import {makeSlug} from '../../libs/utils';
import React from 'react';

export default class PlantItem extends React.Component {

  constructor() {
    super();
  }

  render() {
    const {
      title,
      _id,
    } = this.props || {};

    const link = `/plant/${makeSlug(title)}/${_id}`;

    return (
      <h4>
        <Link
          style={{margin: '20px'}}
          to={link}
        >
          <span>{title}</span>
        </Link>
      </h4>
    );
  }
}

PlantItem.propTypes = {
  _id: React.PropTypes.string.isRequired,
  imageUrl: React.PropTypes.string,
  name: React.PropTypes.string,
  title: React.PropTypes.string,
};
