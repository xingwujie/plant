
module.exports = (data = {}) => {
  const {
    html = '',
    initialState = {},
    title = 'Plaaant',
  } = data;

  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="manifest" href="/manifest.json">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta charset="UTF-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="theme-color" content="#ffffff">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
  </head>
  <body>
    <div id='wrapper'>
      ${html}
    </div>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
    </script>
    <script src="/bundle.js"></script>
  </body>
</html>`;
};
