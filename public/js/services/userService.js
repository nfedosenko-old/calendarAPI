function Auth($state) {
  const self = this;

  self.logout = () => {
    localStorage.removeItem('accessToken');
    $state.go('login');
  };
}

angular.module('koach').service('Auth', Auth);
