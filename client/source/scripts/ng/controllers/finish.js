export default function ($scope, $stateParams, $http) {
    $scope.result = $stateParams;
    if ($scope.result.success) {
        $scope.title = 'Accept';
        $scope.class = 'res_yes';
        $scope.bar_class = 'progress-bar-success'
    }
    else {
        $scope.title = 'Not accept';
        $scope.class = 'res_no';
        $scope.bar_class = 'progress-bar-warning'
    }

    $scope.width_res = $scope.calculate($scope.result.answers, $scope.result.all);
    $scope.width_need = $scope.calculate($scope.result.target, $scope.result.all);
    
    $scope.calculate = function (number, max) {
        var one_pro = max / 100;
        return Math.ceil(max / one_pro);
    }
}