export default function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('otherwise');

    $stateProvider.state('index', {
        url: "/",
        templateUrl: '/src/scripts/ng/views/pages/index.html',
        controller: 'index'
    }).state('admin', {
        url: "/admin",
        templateUrl: '/src/scripts/ng/views/pages/admin.html',
        controller: 'admin'
    }).state("otherwise", {
        url: "*path",
        templateUrl: "/src/scripts/ng/views/pages/e404.html"
    });

    $locationProvider.html5Mode(true);
    // $routeProvider.when('/', {
    //     templateUrl: '/src/scripts/ng/views/pages/index.html',
    //     controller: 'index'
    // }).when('/admin', {
    //     templateUrl: function (auth) {
    //         console.log(auth);
    //         // return auth('admin').then(function (resolve) {
    //         //     return resolve;
    //         // })
    //     },
    //     controller: 'admin'
    // }).otherwise({
    //     templateUrl: '/src/scripts/ng/views/pages/e404.html'
    // });
};
