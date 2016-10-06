
const marked = require('marked');
const React = require('react');

class Markdown extends React.Component {
  render() {
    var markdown = {__html: marked(this.props.markdown || '')};
    return <div dangerouslySetInnerHTML={markdown } />;
  }
}

Markdown.propTypes = {
  markdown: React.PropTypes.string,
};

module.exports = Markdown;
