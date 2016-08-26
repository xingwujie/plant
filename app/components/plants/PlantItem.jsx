// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
import {Link} from 'react-router';
import {makeSlug} from '../../libs/utils';
import React from 'react';
import {GridTile} from 'material-ui/GridList';

export default class PlantItem extends React.Component {

  constructor() {
    super();
  }

  render() {
    const {
      title,
      _id,
      imageUrl = '/img/apple-silhouette.jpg',
      name // eslint-disable-line no-shadow
    } = this.props || {};

    const imageStyle = {
      height: '200px',
      width: '200px'
    };

    const subtitle = name && (<span>by <b>{name}</b></span>);

    const link = `/plant/${makeSlug(title)}/${_id}`;

    return (
      <Link
        style={{margin: '20px'}}
        to={link}
      >
        <GridTile
          key={imageUrl}
          subtitle={subtitle}
          title={title}
        >
          <img
            src={imageUrl}
            style={imageStyle}
          />
        </GridTile>
      </Link>
    );
  }
}

PlantItem.propTypes = {
  _id: React.PropTypes.string.isRequired,
  imageUrl: React.PropTypes.string,
  name: React.PropTypes.string,
  title: React.PropTypes.string,
};
