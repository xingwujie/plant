module.exports = (initialState = {}) => {

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
      <title>Sorry, Page Not Found | Plaaant</title>
    </head>
    <body>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
         
      <div class="page" class="container">
        <div class="container">
          <div class="row">
            <div class="col-sm-6 col-sm-offset-3">
              <section id="oops" class="row">
                <div class="col-sm-6">
                  <img src="/img/mango.gif" class="img-responsive" />
                </div>
                
                <div class="col-sm-6">
                  <h1>404</h1>
                  <p>We could not find the page you were looking for. Please check the link and try again.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <script src="/bundle.js"></script>
    </body>
</html>`;
};
