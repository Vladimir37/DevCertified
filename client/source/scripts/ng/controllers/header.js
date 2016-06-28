export default function($scope, $uibModal) {
    $scope.log_data = {};
    $scope.reg_data = {};
    $scope.open_login = function (size) {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modal_login.html',
            controller: 'header',
            size: ''
        });
    };
    $scope.open_registration = function (size) {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modal_registration.html',
            controller: 'header',
            size: ''
        });
    };

    $scope.send_log = function () {
        if ($scope.log_form.$valid) {
            $scope.error = null;
        }
        else {
            $scope.error = 'Required fields are empty!';
            return false;
        }
        //
    }
    $scope.send_reg = function () {
        console.log($scope.reg_form);
        if ($scope.reg_form.$valid) {
            $scope.error = null;
        }
        else {
            if ($scope.reg_form.$error.minlength) {
                $scope.error = 'Password is too short!';
                return false;
            }
            else {
                $scope.error = 'Required fields are empty!';
                return false;
            }
        }
        if ($scope.reg_data.password != $scope.reg_data.password_two) {
            $scope.error = 'The entered passwords are not equal!';
            return false;
        }
    };
}
