
describe('/version-check/', function() {

  it('should check that we are testing with the right version of node', (done) => {

    require('nodeversioncheck');
    done();

  });

});
