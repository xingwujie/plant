
const marked = require('marked');
const React = require('react');
const PropTypes = require('prop-types');

class Markdown extends React.Component {
  render() {
    var markdown = {__html: marked(this.props.markdown || '')};
    return <div dangerouslySetInnerHTML={markdown } />;
  }
}

Markdown.propTypes = {
  markdown: PropTypes.string,
};

module.exports = Markdown;
