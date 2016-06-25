import Angular from 'angular';
import {one, two} from './controllers/controller';
import Router from './router';

var app = Angular.module('DevCertified', ['ngRoute']);

app.controller('one', one);
app.controller('two', two);

app.config(['$locationProvider', '$routeProvider', Router]);
