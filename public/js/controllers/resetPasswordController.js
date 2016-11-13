function ResetPasswordCtrl($scope, $stateParams, $http, $state) {
  const token = $stateParams.resetPasswordToken;
  const self = $scope;

  self.newPasswordInitial = '';
  self.newPasswordConfirm = '';

  self.resetSuccessfull = false;

  self.resetPassword = (newPassword) => {
    console.log(newPassword);
    $http.post('/api/reset-password', {
      resetPasswordToken: token,
      newPassword,
    }).then((response) => {
      self.resetSuccessfull = response.data.success;
    });
  };

  self.checkPasswords = (pass, passConfirm) => {
    const checkIfValuesEntered = pass !== '' && passConfirm !== '';
    const checkIfValuesIdentical = pass === passConfirm;

    return checkIfValuesEntered && checkIfValuesIdentical;
  };

  self.goToLogin = () => {
    $state.go('login');
  };
}

angular.module('koach').controller('ResetPasswordCtrl', ResetPasswordCtrl);