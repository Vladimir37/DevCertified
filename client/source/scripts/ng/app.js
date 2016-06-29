import Angular from 'angular';
import Bootstrap from 'angular-ui-bootstrap';
import Cookies from 'angular-cookies';

import Router from './router';
import header from './controllers/header';
import login from './controllers/modals/login';
import registration from './controllers/modals/registration';
import end_registration from './controllers/modals/end_registration';
import navbar from './directives/navbar';

var app = Angular.module('DevCertified', ['ngRoute', 'ui.bootstrap', 'ngCookies']);

// controllers
app.controller('header', header);

// modal controllers
app.controller('login', login);
app.controller('registration', registration);
app.controller('end_registration', end_registration);

// directives
app.directive('navbar', navbar)

app.config(['$locationProvider', '$routeProvider', Router]);
