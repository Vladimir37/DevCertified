export default function index($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/get-tests'
    }).then(function (response) {
        if (response.data.status == 0) {
            $scope.tests = response.data.body;
        }
    }).catch(function (err) {
        console.log(err);
    })
}
