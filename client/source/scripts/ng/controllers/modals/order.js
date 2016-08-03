export default function($scope, $http, $uibModalInstance, user) {
    $scope.user = user;

    $scope.close = function () {
        $uibModalInstance.close();
    };
}