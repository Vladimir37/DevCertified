export default function ($http) {
    return function ($state, $stateParams) {
        if (!$stateParams.cardId) {
            return $state.go('otherwise', {});
        }
        return $http({
            method: 'GET',
            url: '/api/get-test',
            params: {
                test: $stateParams.cardId
            }
        }).then(function (response) {
            if (response.data.status === 0) {
                $state.go('test_full', response.data.body);
            }
            else {
                $state.go('otherwise', {});
            }
        }).catch(function (err) {
            console.log(err);
            $state.go('otherwise', {});
        })
    }
}
