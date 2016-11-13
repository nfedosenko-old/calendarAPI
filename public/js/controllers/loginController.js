function LoginCtrl($scope, $http, $rootScope, $state) {
  const self = $scope;
  const rootScope = $rootScope;

  self.user = {
    email: '',
    password: '',
  };

  self.login = () => {
    if (self.loginForm.$valid) {
      $http.post('/api/login', $scope.user)
        .then((response) => {
          localStorage.user = JSON.stringify(response.data.user);
          rootScope.user = response.data.user;
          localStorage.accessToken = response.data.token;
          $state.go('dashboard');
        }, (error) => {
          console.log(error);
          self.invalidLogin = true;
        });
    }
  };

  self.forgotPassword = () => {
    $state.go('forgotPassword');
  };
}

angular.module('koach').controller('LoginCtrl', LoginCtrl);