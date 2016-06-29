export default function ($locationProvider, $routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/src/scripts/ng/views/pages/index.html',
        controller: 'index'
    }).when('/admin', {
        templateUrl: '/src/scripts/ng/views/pages/admin.html',
        controller: 'admin'
    }).otherwise({
        templateUrl: '/src/scripts/ng/views/pages/e404.html'
    });

    $locationProvider.html5Mode(true);
};
