import Angular from 'angular';

import Router from './router';

import header from './controllers/header';
import login from './controllers/modals/login';
import registration from './controllers/modals/registration';
import info from './controllers/modals/info';
import index from './controllers/index';
import admin from './controllers/admin';
import test_full from './controllers/test_full';
import cabinet from './controllers/cabinet';
import certificate from './controllers/certificate';
import certificate_render from './controllers/certificate_render';
import start from './controllers/start';
import question from './controllers/question';
import finish from './controllers/finish';
import footer from './controllers/footer';
import report from './controllers/modals/report';
import order from './controllers/modals/order';
import activation from './controllers/activation';

import auth_check from './services/auth';
import admin_check from './services/admin';
import test_check from './services/test_check';
import user_check from './services/user_check';
import cert_check from './services/cert_check';
import start_check from './services/start_check';

import navbar from './directives/navbar';
import test_card from './directives/test_card';
import certificate_directive from './directives/certificate';

var app = Angular.module('DevCertified', ['ui.router', 'ui.bootstrap', 'ngCookies', 'angularMoment']);

// controllers
app.controller('header', header);
app.controller('index', index);
app.controller('admin', admin);
app.controller('test_full', test_full);
app.controller('cabinet', cabinet);
app.controller('certificate', certificate);
app.controller('certificate_render', certificate_render);
app.controller('start', start);
app.controller('question', question);
app.controller('finish', finish);
app.controller('footer', footer);
app.controller('activation', activation);

// modal controllers
app.controller('login', login);
app.controller('registration', registration);
app.controller('info', info);
app.controller('report', report);
app.controller('order', order);

// directives
app.directive('navbar', navbar);
app.directive('testCard', test_card);
app.directive('certificate', certificate_directive);

// services
app.service('auth_check', auth_check);
app.service('admin_check', admin_check);
app.service('test_check', test_check);
app.service('user_check', user_check);
app.service('cert_check', cert_check);
app.service('start_check', start_check);

app.config(Router);
