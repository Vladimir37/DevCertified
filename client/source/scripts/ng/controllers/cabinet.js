export default function($scope, $uibModal, $http) {
    $scope.tests = {
        all: {},
        received: [],
        unreceived: [],
        available: [],
        unavailable: []
    };
    $scope.certificates = [];
    $scope.order_data = {};
    $scope.statuses = ['Created', 'Paid', 'Sended'];

    $scope.order_open = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/order.html',
            controller: 'order',
            size: '',
            resolve: {
                user() {
                    return $scope.user;
                }
            }
        });
    };

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
        requests.push($http({
            method: 'GET',
            url: '/api/get-orders'
        }));
        requests.push($http({
            method: 'GET',
            url: '/api/check'
        }));

        Promise.all(requests).then(function (response) {
            if (
                response[0].data.status == 0 &&
                response[1].data.status == 0 &&
                response[2].data.status == 0 &&
                response[3].data.status == 0 &&
                response[4].data.status == 0
            ) {
                $scope.tests = response[0].data.body;
                $scope.certificates = response[1].data.body;
                $scope.solutions = response[2].data.body;
                $scope.orders = response[3].data.body;
                $scope.user = response[4].data.body;
                $scope.$apply();
            }
            else {
                $scope.error = 'Server error';
            }
        }).catch(function (err) {
            $scope.error = 'Server error';
            console.log(err);
        });
    };

    $scope.getData();
}
