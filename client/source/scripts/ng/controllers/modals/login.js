export default function($scope, $http, $uibModalInstance) {
    $scope.log_data = {};
    $scope.send_log = function () {
        if ($scope.log_form.$valid) {
            $scope.error = null;
        }
        else {
            $scope.error = 'Required fields are empty!';
            return false;
        }
        $http({
            method: 'POST',
            url: '/api/login',
            data: $scope.log_data
        }).then(function (response) {
            if (response.data.status == 0) {
                // todo reload navbar
                console.log($scope.$parent);
                if (response.data.body.status == 2) {
                    window.location.pathname = '/#/admin';
                    $scope.close();
                    window.location.reload();
                }
                else {
                    window.location.pathname = '/#/cabinet';
                    $scope.close();
                    window.location.reload();
                }
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
