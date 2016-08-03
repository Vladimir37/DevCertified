export default function($scope, $http, $uibModalInstance, user, certs) {
    $scope.user = user;
    $scope.certs = certs;
    $scope.order_data = {};
    $scope.error = null;

    $scope.send_order = function () {
        if ($scope.order_form.$invalid) {
            $scope.error = 'Required fields are empty!';
            return false;
        }
        $scope.error = null;
        $http({
            method: 'POST',
            url: '/api/create-order',
            data: $scope.order_data
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                console.log(response);
            }
            else {
                $scope.error = response.body;
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