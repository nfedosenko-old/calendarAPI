angular.module('koach').config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      data: {
        requireLogin: false,
      },
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl',
      resolve: {
        users: function getUsers(Models) {
          return Models.User.query().$promise;
        },
      },
      data: {
        requireLogin: true,
      },
    })
    .state('resetPassword', {
      url: '/reset-password?resetPasswordToken',
      templateUrl: 'views/resetPassword.html',
      controller: 'ResetPasswordCtrl',
      data: {
        requireLogin: false,
      },
    })
    .state('forgotPassword', {
      url: '/forgot-password',
      templateUrl: 'views/forgotPassword.html',
      controller: 'ForgotPasswordCtrl',
      data: {
        requireLogin: false,
      },
    })
    .state('confirmEmail', {
      url: '/confirm-email?confirmationToken',
      templateUrl: 'views/confirmEmail.html',
      controller: 'ConfirmEmailCtrl',
      data: {
        requireLogin: false,
      },
    });
});
