// const Base = require('../Base');
// const React = require('react');
// const Paper from 'material-ui/Paper';
// const Modernizr from 'modernizr';

// class Test extends React.Component {
//   render() {
//     const paperStyle = {
//       padding: 20,
//       width: '100%',
//       margin: 20,
//       display: 'inline-block'
//     };

//     const events = [
//       'drag',
//       'dragend',
//       'dragenter',
//       'dragexit',
//       'dragleave',
//       'dragover',
//       'dragstart',
//       'drop',
//       'mousedown',
//       'mouseenter',
//       'mouseleave',
//       'mousemove',
//       'mouseout',
//       'mouseover',
//       'mouseup'
//     ].map(e => {
//       return (
//         <div key={e}>{`${e}: ${Modernizr.hasEvent(e)}`}</div>
//       );
//     });

//     return (
//       <Base>
//         <Paper style={paperStyle} zDepth={5}>
//           <div>{'Modernizr reports the following events available:'}</div>
//           {events}
//         </Paper>
//       </Base>
//     );
//   }
// }
