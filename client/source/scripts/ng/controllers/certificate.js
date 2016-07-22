export default function($scope, $stateParams) {
    $scope.certificate = $stateParams.cert || $stateParams;
    $scope.addr = window.location.hostname + '/#/certificate/' + $scope.certificate._id;

    $scope.select_text = function ($event) {
        $event.target.select();
    }
}
