const React = require('react');
const Immutable = require('immutable');

const List = Immutable.List;

class NoteReadImages extends React.Component {

  buildImageUrl(size, image) {
    const id = image.get('id');
    const ext = image.get('ext');
    const folder = process.env.NODE_ENV === 'production' ? 'up' : 'test';
    return `//i.plaaant.com/${folder}/${size}/${id}${ext && ext.length ? '.' : ''}${ext}`;
  }

  buildImageSrc(image) {
    const sizes = image.get('sizes', List()).toJS();
    const size = sizes && sizes.length
      ? sizes[sizes.length - 1].name
      : 'orig';
    return this.buildImageUrl(size, image);
  }

  buildImageSrcSet(image) {
    const sizes = image.get('sizes', List()).toJS();
    if(sizes && sizes.length) {
      // <img src="small.jpg" srcset="medium.jpg 1000w, large.jpg 2000w" alt="yah">
      const items = sizes.map(size => `${this.buildImageUrl(size.name, image)} ${size.width}w `);
      return items.join(',');
    } else {
      return '';
    }
  }

  render() {
    const {note} = this.props;
    const images = note.get('images');
    const imageStyle = {
      maxWidth: '100%',
      padding: '1%'
    };
    if(images && images.size) {
      return (
        <div>
          {images.map(image => {
            return (
              <div key={image.get('id')}>
                <img style={imageStyle} src={this.buildImageSrc(image)} srcSet={this.buildImageSrcSet(image)} />
              </div>
            );
          })}
        </div>);
    } else {
      return null;
    }
  }

}

NoteReadImages.propTypes = {
  note: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = NoteReadImages;
