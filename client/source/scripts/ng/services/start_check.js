export default function ($http) {
    return function ($state, $stateParams) {
        if (!$stateParams.testId) {
            return $state.go('otherwise', {});
        }
        $http({
            method: 'GET',
            url: '/api/get-test-status',
            params: {
                test: $stateParams.testId
            }
        }).then(function (response) {
            response = response.data;
            $scope.response = response;
            if (response.status == 0) {
                return $state.go('start', {});
            }
            else {
                return $state.go('otherwise', {});
            }
        }).catch(function (err) {
            console.log(err);
            return $state.go('otherwise', {});
        });
    }
}
