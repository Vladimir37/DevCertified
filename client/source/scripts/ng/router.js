export default function ($locationProvider, $routeProvider) {
    $routeProvider.when('/one', {
        templateUrl: '/src/scripts/ng/views/title.html',
        controller: 'one'
    }).when('/two', {
        templateUrl: '/src/scripts/ng/views/title.html',
        controller: 'two'
    }).otherwise('/one');
    
    $locationProvider.html5Mode(true);
};