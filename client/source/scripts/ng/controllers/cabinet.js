export default function($scope, $uibModal, $state, $http) {
    $scope.tests = {
        all: {},
        received: [],
        unreceived: [],
        available: [],
        unavailable: []
    };
    $scope.certificates = [];
    $scope.statuses = ['Created', 'Checking', 'Paid', 'Sended'];
    $scope.notify_url = window.location.origin;
    $scope.change_data = {
        old: '',
        new1: '',
        new2: ''
    };
    $scope.forms = {};
    $scope.error = null;
    $scope.change_error = null;

    $scope.order_open = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/order.html',
            controller: 'order',
            size: '',
            resolve: {
                user() {
                    return $scope.user;
                },
                certs() {
                    return $scope.certificates;
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

    $scope.change_pass = function () {
        if ($scope.forms.change_form.$invalid) {
            $scope.change_error = 'Required fields are empty';
            return false;
        }
        if ($scope.change_data.new1 != $scope.change_data.new2) {
            $scope.change_error = 'Passwords are not equal';
            return false;
        }
        if ($scope.change_data.new1.length < 6) {
            $scope.change_error = 'New password too short';
            return false;
        }
        $scope.change_error = null;
        $http({
            method: 'POST',
            url: '/api/change-pass',
            data: $scope.change_data
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $state.go('change_send');
            }
            else {
                console.log(response.body);
                $scope.change_error = 'Server error';
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };

    $scope.getData();
}
