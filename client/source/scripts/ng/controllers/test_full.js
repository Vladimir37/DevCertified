export default function ($scope, $stateParams, $http) {
    $scope.test_data = $stateParams;
    $scope.error = null;
    $scope.active = false;
    $scope.alert_type = null;
    $scope.alert = false;
    $http({
        method: 'GET',
        url: '/api/get-test-status',
        params: {
            test: $scope.test_data._id
        }
    }).then(function (response) {
        response = response.data;
        $scope.response = response;
        if (response.status) {
            $scope.alert = true;
        }
        if (response.status == 2 && response.status == 1 && response.status == 4) {
            $scope.alert_type = 'alert-danger';
        }
        else if (response.status == 5) {
            $scope.alert_type = 'alert-success';
        }
        else {
            $scope.alert_type = 'alert-info';
        }
    }).catch(function (err) {
        console.log(err);
        $scope.error = 'Server error';
    })
}
