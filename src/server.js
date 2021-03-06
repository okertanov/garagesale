/**
    @file       server.js
    @brief      Node.JS Server.

    @author     Oleg Kertanov <okertanov@gmail.com>
    @date       May 2012
    @copyright  Copyright (C) 2012 Oleg Kertanov <okertanov@gmail.com>
    @license    BSD
    @see LICENSE file
*/

(function()
{

// Strict mode by default
"use strict";

// System modules
var os      = require('os'),
    fs      = require('fs'),
    path    = require('path'),
    express = require('express');

// App modules
var ApiController = require('./api-controller.js').ApiController;

// Pathes
var ServerRoot  = __dirname,
    ProjectRoot = path.normalize(ServerRoot + '/../'),
    WWWRoot     = path.normalize(ProjectRoot + '/wwwroot/');

// Configuration
var Port = 8882;

// Express application
var app = express.createServer();

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

ApiController.Initialize();
ApiController.Route(app);

// Server
app.listen(Port);

process
    .on('exit', function () {
        ApiController.Terminate();
    })
    .on('uncaughtException', function (e){
        console.log(e, e.toString());
    })
    .on('SIGINT', function () {
        ApiController.Terminate();
        process.exit();
    });

})()

