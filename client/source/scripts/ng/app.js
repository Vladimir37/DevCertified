import Angular from 'angular';
import Modal from 'angular-ui-bootstrap';
import Router from './router';
import header from './controllers/header';

var app = Angular.module('DevCertified', ['ngRoute', 'ui.bootstrap']);

app.controller('header', header);

app.config(['$locationProvider', '$routeProvider', Router]);
