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
      logout: this.logout,
      isLoggedIn: this.isLoggedIn,
      isOwner: this.isOwner
    });
  }

  login(user) {
    console.log('login():', user);
    if(user.jwt) {
      // this.user = user;
      this.setState({user});
      localStorage.setItem('user', user);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.user = {};
    this.setState({user: ''});
  }

  isLoggedIn() {
    return this.state && this.state.user && this.state.user.jwt;
  }

  isOwner(object) {
    return this.state && this.state.user &&
      this.state.user.jwt && this.state.user._id &&
      object && object.userId === this.state.user._id;
  }
}

export default alt.createStore(LoginStore, 'LoginStore');
