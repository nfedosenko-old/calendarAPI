'use strict';

angular.module('koach', ['ui.router', 'ui.bootstrap', 'angular-jwt', 'ngResource']).config(function ($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function () {
    return localStorage.getItem('accessToken');
  };
  $httpProvider.interceptors.push('jwtInterceptor');
}).run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (requireLogin && (!localStorage.accessToken || localStorage.accessToken === 'undefined')) {
      event.preventDefault();
      $state.go('login');
    }
  });
});

angular.module('koach').service('Modal', ["$uibModal", "Models", function ($uibModal, Models) {
  var self = this;

  self.openConfirmModal = function openConfirmModal() {
    return $uibModal.open({
      templateUrl: './views/confirmModal.html',
      controller: function controller($scope, $uibModalInstance) {
        var scope = $scope;
        scope.ok = function () {
          $uibModalInstance.close();
        };

        scope.cancel = function () {
          $uibModalInstance.dismiss();
        };
      }
    });
  };

  self.openAddUserModal = function openAddUserModal() {
    return $uibModal.open({
      templateUrl: './views/addUserModal.html',
      controller: function controller($scope, $uibModalInstance) {
        var scope = $scope;
        scope.user = {};

        scope.ok = function () {
          $uibModalInstance.close($scope.user);
        };

        scope.cancel = function () {
          $uibModalInstance.dismiss();
        };
      }
    });
  };

  self.openEditUserModal = function openEditUserModal(user) {
    return $uibModal.open({
      templateUrl: './views/editUserModal.html',
      controller: function controller($scope, $uibModalInstance, user) {
        var scope = $scope;
        scope.user = user;

        scope.ok = function () {
          $uibModalInstance.close($scope.user);
        };

        scope.cancel = function () {
          $uibModalInstance.dismiss();
        };
      },
      resolve: {
        user: user
      }
    });
  };
}]);

Auth.$inject = ["$state"];function Auth($state) {
  var self = this;

  self.logout = function () {
    localStorage.removeItem('accessToken');
    $state.go('login');
  };
}

angular.module('koach').service('Auth', Auth);

angular.module('koach').controller('AppController', function () {});

LoginCtrl.$inject = ["$scope", "$http", "$rootScope", "$state"];function LoginCtrl($scope, $http, $rootScope, $state) {
  var self = $scope;
  var rootScope = $rootScope;

  self.user = {
    email: '',
    password: ''
  };

  self.login = function () {
    if (self.loginForm.$valid) {
      $http.post('/api/login', $scope.user).then(function (response) {
        localStorage.user = JSON.stringify(response.data.user);
        rootScope.user = response.data.user;
        localStorage.accessToken = response.data.token;
        $state.go('dashboard');
      }, function (error) {
        console.log(error);
        self.invalidLogin = true;
      });
    }
  };

  self.forgotPassword = function () {
    $state.go('forgotPassword');
  };
}

angular.module('koach').controller('LoginCtrl', LoginCtrl);
/**
 *
 * @param $scope
 * @param users
 * @param Modal
 * @param Models
 * @param Auth
 * @constructor
 */
DashboardCtrl.$inject = ["$scope", "users", "Modal", "Models", "Auth"];
function DashboardCtrl($scope, users, Modal, Models, Auth) {
  var self = $scope;

  self.users = users;

  function refreshUserList() {
    Models.User.query().$promise.then(function (allUsers) {
      self.users = allUsers;
    });
  }

  self.deleteUser = function (userId) {
    Modal.openConfirmModal().result.then(function () {
      Models.User.delete({ id: userId }).$promise.then(refreshUserList);
    });
  };

  self.openEditUserModal = function (user) {
    Modal.openEditUserModal(user).result.then(function () {
      Models.User.save({ id: user._id }, user).$promise.then(refreshUserList);
    });
  };

  self.openAddUserModal = function () {
    Modal.openAddUserModal().result.then(function (response) {
      Models.User.create(response).$promise.then(refreshUserList);
    });
  };

  self.logout = Auth.logout;
}

angular.module('koach').controller('DashboardCtrl', DashboardCtrl);

ConfirmEmailCtrl.$inject = ["$scope", "$stateParams", "$http"];function ConfirmEmailCtrl($scope, $stateParams, $http) {
  var token = $stateParams.confirmationToken;

  $http.post('/api/confirm-email', { confirmationToken: token }).then(function (response) {
    console.log(response);
  });
}

angular.module('koach').controller('ConfirmEmailCtrl', ConfirmEmailCtrl);

ResetPasswordCtrl.$inject = ["$scope", "$stateParams", "$http", "$state"];function ResetPasswordCtrl($scope, $stateParams, $http, $state) {
  var token = $stateParams.resetPasswordToken;
  var self = $scope;

  self.newPasswordInitial = '';
  self.newPasswordConfirm = '';

  self.resetSuccessfull = false;

  self.resetPassword = function (newPassword) {
    console.log(newPassword);
    $http.post('/api/reset-password', {
      resetPasswordToken: token,
      newPassword: newPassword
    }).then(function (response) {
      self.resetSuccessfull = response.data.success;
    });
  };

  self.checkPasswords = function (pass, passConfirm) {
    var checkIfValuesEntered = pass !== '' && passConfirm !== '';
    var checkIfValuesIdentical = pass === passConfirm;

    return checkIfValuesEntered && checkIfValuesIdentical;
  };

  self.goToLogin = function () {
    $state.go('login');
  };
}

angular.module('koach').controller('ResetPasswordCtrl', ResetPasswordCtrl);

ForgotPasswordCtrl.$inject = ["$scope", "$http"];function ForgotPasswordCtrl($scope, $http) {
  var self = $scope;

  self.emailForConfirm = '';

  self.sentSuccessfull = false;

  self.sendForgotPasswordEmail = function (email) {
    $http.post('/api/forgot-password', { email: email }).then(function (response) {
      self.sentSuccessfull = response.data.success;
    });
  };
}

angular.module('koach').controller('ForgotPasswordCtrl', ForgotPasswordCtrl);
angular.module('koach').service('Models', ["$resource", function ($resource) {
  this.User = $resource('/api/users/:id', { id: '@_id' }, {
    query: { method: 'GET', isArray: true },
    save: { method: 'PUT' },
    create: { method: 'POST' },
    delete: { method: 'DELETE' }
  });
}]);

angular.module('koach').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl',
    data: {
      requireLogin: false
    }
  }).state('dashboard', {
    url: '/dashboard',
    templateUrl: 'views/dashboard.html',
    controller: 'DashboardCtrl',
    resolve: {
      users: ["Models", function getUsers(Models) {
        return Models.User.query().$promise;
      }]
    },
    data: {
      requireLogin: true
    }
  }).state('resetPassword', {
    url: '/reset-password?resetPasswordToken',
    templateUrl: 'views/resetPassword.html',
    controller: 'ResetPasswordCtrl',
    data: {
      requireLogin: false
    }
  }).state('forgotPassword', {
    url: '/forgot-password',
    templateUrl: 'views/forgotPassword.html',
    controller: 'ForgotPasswordCtrl',
    data: {
      requireLogin: false
    }
  }).state('confirmEmail', {
    url: '/confirm-email?confirmationToken',
    templateUrl: 'views/confirmEmail.html',
    controller: 'ConfirmEmailCtrl',
    data: {
      requireLogin: false
    }
  });
}]);