import Angular from 'angular';

import Router from './router';

import header from './controllers/header';
import login from './controllers/modals/login';
import registration from './controllers/modals/registration';
import end_registration from './controllers/modals/end_registration';
import index from './controllers/index';
import admin from './controllers/admin';
import test_full from './controllers/test_full';

import auth_check from './services/auth';
import admin_check from './services/admin';
import test_check from './services/test_check';

import navbar from './directives/navbar';
import test_card from './directives/test_card';

var app = Angular.module('DevCertified', ['ui.router', 'ui.bootstrap', 'ngCookies']);

// controllers
app.controller('header', header);
app.controller('index', index);
app.controller('admin', admin);
app.controller('test_full', test_full);

// modal controllers
app.controller('login', login);
app.controller('registration', registration);
app.controller('end_registration', end_registration);

// directives
app.directive('navbar', navbar);
app.directive('testCard', test_card);

// services
app.service('auth_check', auth_check);
app.service('admin_check', admin_check);
app.service('test_check', test_check);

app.config(Router);
