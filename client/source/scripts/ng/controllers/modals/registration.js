export default function($scope, $http, $uibModal, $uibModalInstance) {
    $scope.reg_data = {};
    $scope.send_reg = function () {
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
        $http({
            method: 'POST',
            url: '/api/registration',
            data: $scope.reg_data
        }).then(function (response) {
            if (response.data.status == 0) {
                $uibModalInstance.close();
                $uibModal.open({
                    animation: true,
                    templateUrl: '/src/scripts/ng/views/modals/end_registration.html',
                    controller: 'info',
                    size: ''
                });
            }
            else {
                $scope.error = response.data.body;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };

    $scope.close = function () {
        $uibModalInstance.close();
    };
}
