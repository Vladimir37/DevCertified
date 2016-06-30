import Angular from 'angular';

import Router from './router';

import header from './controllers/header';
import login from './controllers/modals/login';
import registration from './controllers/modals/registration';
import end_registration from './controllers/modals/end_registration';
import index from './controllers/index';
import admin from './controllers/admin';

import auth from './services/auth';

import navbar from './directives/navbar';

var app = Angular.module('DevCertified', ['ui.router', 'ui.bootstrap', 'ngCookies']);

// controllers
app.controller('header', header);
app.controller('index', index);
app.controller('admin', admin);

// modal controllers
app.controller('login', login);
app.controller('registration', registration);
app.controller('end_registration', end_registration);

// directives
app.directive('navbar', navbar);

// services
app.service('auth', auth);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', Router]);
