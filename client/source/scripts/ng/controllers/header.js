export default function($scope, $uibModal, $http) {
    $scope.open_login = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/login.html',
            controller: 'login',
            size: ''
        });
    };
    $scope.open_registration = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/registration.html',
            controller: 'registration',
            size: ''
        });
    };
    $scope.logout = function () {
        $http.post('/api/logout').then(function () {
            window.location.reload();
        })
    }
}
