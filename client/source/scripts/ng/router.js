export default function ($stateProvider, $urlRouterProvider, $locationProvider, auth) {
    $urlRouterProvider.otherwise('otherwise');

    $stateProvider.state('index', {
        url: "/",
        templateUrl: '/src/scripts/ng/views/pages/index.html',
        controller: 'index'
    }).state('check_admin', {
        url: "/admin",
        controller: function ($state, admin_check) {
            admin_check($state, 'admin');
        }
    }).state('admin', {
        templateUrl: '/src/scripts/ng/views/pages/admin.html',
    }).state("otherwise", {
        url: "*path",
        templateUrl: "/src/scripts/ng/views/pages/e404.html"
    });

    $locationProvider.html5Mode(true);
};
