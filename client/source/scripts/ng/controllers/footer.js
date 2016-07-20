export default function ($scope, $uibModal) {
    $scope.open_modal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '/src/scripts/ng/views/modals/report.html',
            controller: 'report',
            size: '',
            resolve: {
                question() {
                    return null
                }
            }
        });
    }
}
