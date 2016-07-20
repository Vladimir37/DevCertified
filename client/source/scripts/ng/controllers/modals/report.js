export default function($scope, $cookies, $uibModal, $uibModalInstance, $http) {
    $scope.logged = Boolean($cookies.get('dclog'));
    $scope.report_data = {
        type: '0'
    };
    $scope.close = function () {
        $uibModalInstance.close();
    };
    $scope.send = function () {
        if ($scope.report_form.$invalid) {
            $scope.error = 'Required fields are empty!';
            return false;
        }
        $scope.error = null;
        $http({
            method: 'POST',
            url: '/api/report',
            data: $scope.report_data
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $uibModalInstance.close();
                $uibModal.open({
                    animation: true,
                    templateUrl: '/src/scripts/ng/views/modals/send_report.html',
                    controller: 'info',
                    size: ''
                });
            }
            else {
                $scope.error = response.body;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    }
}
