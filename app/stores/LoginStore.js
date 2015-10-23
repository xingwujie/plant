import alt from '../libs/alt';
import LoginActions from '../actions/LoginActions';

class LoginStore {
  constructor() {
    // If the user has already logged in and not logged out
    // there there should be an entry in localStorage that
    // can be used to initialize the user object.
    const storedUser = localStorage.getItem('user');
    this.user = storedUser;

    this.bindListeners({
      login: LoginActions.LOGIN,
      logout: LoginActions.LOGOUT
    });

    this.exportPublicMethods({
      login: this.login,
      logout: this.logout
    });
  }

  login(user) {
    if(user.jwt) {
      this.user = user;
      localStorage.setItem('user', user);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.user = {};
  }
}

export default alt.createStore(LoginStore, 'LoginStore');
