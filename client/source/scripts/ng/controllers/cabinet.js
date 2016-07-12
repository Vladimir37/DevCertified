export default function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/get-category-tests'
    }).then(function (response) {
        if (response.data.status == 0) {
            $scope.tests = response.data.body;
        }
        else {
            $scope.error = response.data.body;
        }
    }).catch(function (err) {
        $scope.error = 'Server error';
        console.log(err);
    })
}
