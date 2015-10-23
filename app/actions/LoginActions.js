import $ from 'jquery';
import alt from '../libs/alt';

class LoginActions {
  logout() {
    this.dispatch();
  }

  login(code) {
    // The LoginStore has a listener registered against this.
    $.get(`/auth/with?code=${code}`, (user) => {
      this.dispatch(user);
    });
  }

}

export default alt.createActions(LoginActions);
