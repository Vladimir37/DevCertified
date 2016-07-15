export default function ($http) {
    return function ($state, $stateParams) {
        if (!$stateParams.testId) {
            return $state.go('otherwise', {});
        }
        var test_data;
        return $http({
            method: 'GET',
            url: '/api/get-test',
            params: {
                test: $stateParams.testId
            }
        }).then(function (response) {
            if (response.data.status != 0) {
                return $state.go('otherwise', {});
            }
            test_data = response.data.body;
            return $http({
                method: 'GET',
                url: '/api/get-test-status',
                params: {
                    test: $stateParams.testId
                }
            });
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                return $state.go('start', test_data);
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
