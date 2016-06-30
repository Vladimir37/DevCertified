export default function ($http) {
    return function (page) {
        return $http({
            method: 'GET',
            url: '/api/check'
        }).then(function (response) {
            if (response.status === 0) {
                return '/src/scripts/ng/views/pages/' + page + '.html';
            }
            else {
                return '/src/scripts/ng/views/pages/e404.html';
            }
        }).catch(function (err) {
            console.log(err);
            return '/src/scripts/ng/views/pages/e404.html';
        })
    }
}
