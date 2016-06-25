import Angular from 'angular';
import {one, two} from './controllers/controller';

var app = Angular.module('DevCertified', ['ngRoute']);

app.controller('one', one);
app.controller('two', two);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider.when('/one', {
      templateUrl: '/src/scripts/views/title.html',
      controller: 'one'
    }).when('/two', {
      templateUrl: '/src/scripts/views/title.html',
      controller: 'two'
    }).otherwise('/one');
    
    $locationProvider.html5Mode(true);
}]);
