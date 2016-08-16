export default function ($http) {
    return function ($state, $stateParams) {
        if (!$stateParams.code) {
            return $state.go('otherwise', {});
        }
        // 57b30748058bfaad2eac6905
        return $http({
            method: 'POST',
            url: '/api/change-pass-confirm',
            data: {
                id: $stateParams.code
            }
        }).then(function (response) {
            response = response.data;
            console.log(response);
            if (response.status === 0) {
                $state.go('success_change');
            }
            else {
                $state.go('otherwise', response.body);
            }
        }).catch(function (err) {
            console.log(err);
            $state.go('otherwise', {});
        });
    }
}
