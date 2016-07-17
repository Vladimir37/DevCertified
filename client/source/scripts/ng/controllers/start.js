export default function ($scope, $stateParams, $http, $state) {
    $scope.test_data = $stateParams;
    $scope.start_testing = function () {
        $http({
            method: 'POST',
            url: '/api/start-testing',
            data: {
                num: $scope.test_data._id
            }
        }).then(function (response) {
            response = response.data;
            response.body.complexities = [$scope.test_data.easyTime, $scope.test_data.middleTime, $scope.test_data.hardTime];
            if (response.status == 0) {
                $state.go('question', response.body);
            }
            else {
                console.log(response);
                $scope.error = 'Server error';
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    }
}
