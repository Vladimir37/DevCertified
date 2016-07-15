export default function ($http) {
    return function ($state, component) {
        return $http({
            method: 'GET',
            url: '/api/check'
        }).then(function (response) {
            if (response.data.status === 0) {
                $state.go(component);
            }
            else {
                $state.go('otherwise', {}, {location: false});
            }
        }).catch(function (err) {
            console.log(err);
            $state.go('otherwise', {}, {location: false});
        });
    }
}
