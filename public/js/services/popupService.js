angular.module('koach').service('Modal', function ($uibModal, Models) {
  const self = this;

  self.openConfirmModal = function openConfirmModal() {
    return $uibModal.open({
      templateUrl: './views/confirmModal.html',
      controller: ($scope, $uibModalInstance) => {
        const scope = $scope;
        scope.ok = () => {
          $uibModalInstance.close();
        };

        scope.cancel = () => {
          $uibModalInstance.dismiss();
        };
      },
    });
  };

  self.openAddUserModal = function openAddUserModal() {
    return $uibModal.open({
      templateUrl: './views/addUserModal.html',
      controller: ($scope, $uibModalInstance) => {
        const scope = $scope;
        scope.user = {};

        scope.ok = () => {
          $uibModalInstance.close($scope.user);
        };

        scope.cancel = () => {
          $uibModalInstance.dismiss();
        };
      },
    });
  };

  self.openEditUserModal = function openEditUserModal(user) {
    return $uibModal.open({
      templateUrl: './views/editUserModal.html',
      controller: ($scope, $uibModalInstance, user) => {
        const scope = $scope;
        scope.user = user;

        scope.ok = () => {
          $uibModalInstance.close($scope.user);
        };

        scope.cancel = () => {
          $uibModalInstance.dismiss();
        };
      },
      resolve: {
        user,
      },
    });
  };
});
