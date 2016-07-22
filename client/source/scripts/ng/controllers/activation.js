export default function ($scope, $stateParams, $state, $http) {
    var code = $stateParams.code;
    if (!code) {
        $state.go('otherwise');
    }
    $http({
        method: 'GET',
        url: '/api/confirm',
        params: {code}
    }).then(function (response) {
        response = response.data;
        console.log(response);
        if (response.status == 0) {
            $state.go('success_activation');
        }
        else {
            $state.go('otherwise');
        }
    }).catch(function (err) {
        console.log(err);
        $state.go('otherwise');
    });
}
