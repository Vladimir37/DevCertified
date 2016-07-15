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
    }).state('check_cabinet', {
        url: '/cabinet',
        controller: function ($state, user_check) {
            user_check($state);
        }
    }).state('cabinet', {
        templateUrl: '/src/scripts/ng/views/pages/cabinet.html',
        controller: 'cabinet'
    }).state('check_test_full', {
        url: '/test_full/:cardId',
        controller: function ($state, $stateParams, test_check) {
            test_check($state, $stateParams);
        }
    }).state('test_full', {
        templateUrl: '/src/scripts/ng/views/pages/test_full.html',
        controller: 'test_full',
        params: {
            _id: null,
            title: null,
            description: null,
            subjects: null,
            easyCol: null,
            middleCol: null,
            hardCol: null,
            easyTime: null,
            middleTime: null,
            hardTime: null,
            img: null
        }
    }).state('check_certify', {
        url: '/certificate/:certId',
        controller: function ($state, $stateParams, cert_check) {
            cert_check($state, $stateParams);
        }
    }).state('certificate', {
        templateUrl: '/src/scripts/ng/views/pages/certificate.html',
        controller: 'certificate',
        params: {
            title: null,
            name: null,
            date: null
        }
    }).state('check_start', {
        url: '/start/:testId',
        controller: function ($state, $stateParams, cert_check) {
            test_check($state, $stateParams);
        }
    }).state('otherwise', {
        url: '*path',
        onEnter: function($state) {
            $state.go('index');
        }
    });
};
