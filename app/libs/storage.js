export default {
  get: function(k) {
    try {
      var v = JSON.parse(localStorage.getItem(k));
      return v;
    }
    catch(e) {
      return null;
    }
  },
  set: function(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }
};
