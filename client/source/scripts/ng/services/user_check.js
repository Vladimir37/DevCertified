export default function ($http) {
    return function ($state) {
        return $http({
            method: 'GET',
            url: '/api/check'
        }).then(function (response) {
            if (response.data.status === 0) {
                $state.go('cabinet');
            }
            else {
                $state.go('otherwise', response.data.body);
            }
        }).catch(function (err) {
            console.log(err);
            $state.go('otherwise', {});
        })
    }
}
