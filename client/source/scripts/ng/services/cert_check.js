export default function ($http) {
    return function ($state, $stateParams) {
        if (!$stateParams.cardId) {
            return $state.go('otherwise', {});
        }
        return $http({
            method: 'GET',
            url: '/api/get-certificate',
            params: {
                cert: $stateParams.certId
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status === 0) {
                $state.go('certificate', response.data.body);
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
