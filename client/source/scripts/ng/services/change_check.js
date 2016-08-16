export default function ($http) {
    return function ($state, $stateParams) {
        if (!$stateParams.code) {
            return $state.go('otherwise', {});
        }
        return $http({
            method: 'GET',
            url: '/api/change-pass-confirm',
            data: {
                id: $stateParams.code
            }
        }).then(function (response) {
            if (response.data.status === 0) {
                $state.go('success_change');
            }
            else {
                $state.go('otherwise', response.data.body);
            }
        }).catch(function (err) {
            console.log(err);
            $state.go('otherwise', {});
        });
    }
}
