export default function ($http) {
    return function ($state, component) {
        return $http({
            method: 'GET',
            url: '/api/get-test',
            // data: {test: }
        }).then(function (response) {
            console.log($state);
            // if (response.data.status === 0) {
            //     $state.go(component);
            // }
            // else {
            //     $state.go('otherwise', {}, {location: false});
            // }
        }).catch(function (err) {
            console.log(err);
            $state.go('otherwise', {}, {location: false});
        })
    }
}
