export default function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('otherwise');

    $stateProvider.state('index', {
        url: '/',
        templateUrl: '/src/scripts/ng/views/pages/index.html',
        controller: 'index'
    }).state('check_admin', {
        url: '/admin',
        controller: function ($state, admin_check) {
            admin_check($state, 'admin');
        }
    }).state('admin', {
        templateUrl: '/src/scripts/ng/views/pages/admin.html',
        controller: 'admin'
    }).state('check_test_full', {
        url: '/test_full/:cardId',
        controller: function ($state, $stateParams, test_check) {
            test_check($state, $stateParams);
        },
    }).state('test_full', {
        templateUrl: '/src/scripts/ng/views/pages/test_full.html',
        controller: 'test_full',
        params: {
            _id: null,
            title: null,
            description: null,
            easyCol: null,
            middleCol: null,
            hardCol: null,
            easyTime: null,
            middleTime: null,
            hardTime: null,
            img: null
        }
    }).state('otherwise', {
        url: '*path',
        // templateUrl: '/src/scripts/ng/views/pages/e404.html'
        onEnter: function($state) {
            $state.go('index');
        }
    });

    // $locationProvider.html5Mode(true);
};
