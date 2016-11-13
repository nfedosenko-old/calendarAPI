function ForgotPasswordCtrl($scope, $http) {
  const self = $scope;

  self.emailForConfirm = '';

  self.sentSuccessfull = false;

  self.sendForgotPasswordEmail = (email) => {
    $http.post('/api/forgot-password', { email }).then((response) => {
      self.sentSuccessfull = response.data.success;
    });
  };
}

angular.module('koach').controller('ForgotPasswordCtrl', ForgotPasswordCtrl);