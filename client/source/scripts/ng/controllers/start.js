export default function ($scope, $stateParams, $http) {
    $scope.test_data = $stateParams;
    $scope.start_testing = function () {
        $http({
            method: 'POST',
            url: '/api/start-testing',
            data: {
                num: $scope.test_data._id
            }
        }).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    }
}
