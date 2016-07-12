export default function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/get-category-tests'
    }).then(function (response) {
        console.log(response);
    }).catch(function (err) {
        $scope.error = err;
        console.log(err);
    })
}
