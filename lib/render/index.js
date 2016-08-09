
export default (initialState = {}) => {

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Plant</title>
  </head>
  <body>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
    </script>
    <script src="/bundle.js"></script>
  </body>
</html>`;
};
