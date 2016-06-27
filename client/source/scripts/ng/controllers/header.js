import {validate} from '../../additional';

export default function($scope, $uibModal) {
    $scope.log_data = {
        username: null,
        password: null
    };
    $scope.reg_data = {};

    $scope.open_login = function (size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modal_login.html',
            controller: 'header',
            size: ''
        });
    };
    $scope.open_registration = function (size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modal_registration.html',
            controller: 'header',
            size: ''
        });
    };

    $scope.send_log = function () {
        console.log(validate($scope.log_data));
    }
    $scope.send_reg = function () {
        //
    };
}
