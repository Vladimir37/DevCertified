import Angular from 'angular';
import Modal from 'angular-ui-bootstrap';
import Router from './router';
import header from './controllers/header';
import login from './controllers/modals/login';
import registration from './controllers/modals/registration';
import end_registration from './controllers/modals/end_registration';

var app = Angular.module('DevCertified', ['ngRoute', 'ui.bootstrap']);

app.controller('header', header);

// modal controllers
app.controller('login', login);
app.controller('registration', registration);
app.controller('end_registration', end_registration);

app.config(['$locationProvider', '$routeProvider', Router]);
