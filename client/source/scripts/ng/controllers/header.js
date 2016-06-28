export default function($scope, $uibModal, $http) {
    $scope.open_login = function (size) {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/login.html',
            controller: 'login',
            size: ''
        });
    };
    $scope.open_registration = function (size) {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/registration.html',
            controller: 'registration',
            size: ''
        });
    };
}
