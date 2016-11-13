angular.module('koach', ['ui.router', 'ui.bootstrap', 'angular-jwt', 'ngResource'])
  .config(($httpProvider, jwtInterceptorProvider) => {
    jwtInterceptorProvider.tokenGetter = () => {
      return localStorage.getItem('accessToken');
    };
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .run(($rootScope, $state) => {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      const requireLogin = toState.data.requireLogin;
      if (requireLogin && (!localStorage.accessToken || localStorage.accessToken === 'undefined')) {
        event.preventDefault();
        $state.go('login');
      }
    });
  });
