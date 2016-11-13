angular.module('koach')
  .service('Models', function ($resource) {
    this.User = $resource('/api/users/:id', { id: '@_id' }, {
      query: { method: 'GET', isArray: true },
      save: { method: 'PUT' },
      create: { method: 'POST' },
      delete: { method: 'DELETE' }
    });
  });
