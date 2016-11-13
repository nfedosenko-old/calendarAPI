function ConfirmEmailCtrl($scope, $stateParams, $http) {
  const token = $stateParams.confirmationToken;

  $http.post('/api/confirm-email', { confirmationToken: token }).then((response) => {
    console.log(response);
  });
}

angular.module('koach').controller('ConfirmEmailCtrl', ConfirmEmailCtrl);