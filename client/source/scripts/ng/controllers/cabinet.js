export default function($scope, $http) {
    $scope.tests = {
        all: {},
        received: [],
        unreceived: [],
        available: [],
        unavailable: []
    };
    $scope.certificates = [];

    $scope.getData = function () {
        var requests = [];
        requests.push($http({
            method: 'GET',
            url: '/api/get-category-tests'
        }));
        requests.push($http({
            method: 'GET',
            url: '/api/get-certificates'
        }));
        requests.push($http({
            method: 'GET',
            url: '/api/get-solutions'
        }));

        Promise.all(requests).then(function (response) {
            if (response[0].data.status == 0 && response[1].data.status == 0 && response[2].data.status == 0) {
                $scope.tests = response[0].data.body;
                $scope.certificates = response[1].data.body;
                $scope.solutions = response[2].data.body;
                $scope.$apply();
            }
            else {
                $scope.error = 'Server error';
            }
        }).catch(function (err) {
            $scope.error = 'Server error';
            console.log(err);
        });
    }

    $scope.getData();
}
