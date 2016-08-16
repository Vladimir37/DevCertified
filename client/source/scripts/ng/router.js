export default function ($stateProvider, $urlRouterProvider) {
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
            test_check($state, $stateParams, 'test_full');
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
            _id: null,
            cert: null,
            title: null,
            name: null,
            date: null
        }
    }).state('check_start', {
        url: '/start/:testId',
        controller: function ($state, $stateParams, start_check) {
            start_check($state, $stateParams, 'start');
        }
    }).state('start', {
        templateUrl: '/src/scripts/ng/views/pages/start.html',
        controller: 'start',
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
    }).state('question', {
        url: '/question',
        templateUrl: '/src/scripts/ng/views/pages/question.html',
        controller: 'question',
        params: {
            _id: null,
            test: null,
            answers: null,
            questions: null,
            complexities: null
        }
    }).state('finish', {
        url: '/finish',
        templateUrl: '/src/scripts/ng/views/pages/finish.html',
        controller: 'finish',
        params: {
            success: null,
            answers: null,
            target: null,
            all: null,
            certificate: null
        }
    }).state('activation', {
        url: '/activation/:code',
        controller: 'activation'
    }).state('success_activation', {
        templateUrl: '/src/scripts/ng/views/pages/success_activation.html'
    }).state('success_payment', {
        url: '/success',
        templateUrl: '/src/scripts/ng/views/pages/success_payment.html'
    }).state('change', {
        url: '/change_confirm/:code',
        controller: function ($state, $stateParams, change_check) {
            change_check($state, $stateParams);
        }
    }).state('success_change', {
        templateUrl: '/src/scripts/ng/views/pages/success_change.html'
    }).state('change_send', {
        templateUrl: '/src/scripts/ng/views/pages/change_send.html'
    }).state('otherwise', {
        url: '*path',
        onEnter: function($state) {
            $state.go('index');
        }
    });
};
