/**
 *
 * @param $scope
 * @param users
 * @param Modal
 * @param Models
 * @param Auth
 * @constructor
 */
function DashboardCtrl($scope, users, Modal, Models, Auth) {
  const self = $scope;

  self.users = users;

  function refreshUserList() {
    Models.User.query().$promise.then((allUsers) => {
      self.users = allUsers;
    });
  }

  self.deleteUser = (userId) => {
    Modal.openConfirmModal().result.then(() => {
      Models.User.delete({ id: userId }).$promise.then(refreshUserList);
    });
  };

  self.openEditUserModal = (user) => {
    Modal.openEditUserModal(user).result.then(() => {
      Models.User.save({ id: user._id }, user).$promise.then(refreshUserList);
    });
  };

  self.openAddUserModal = () => {
    Modal.openAddUserModal().result.then((response) => {
      Models.User.create(response).$promise.then(refreshUserList);
    });
  };

  self.logout = Auth.logout;
}

angular.module('koach').controller('DashboardCtrl', DashboardCtrl);