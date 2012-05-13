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
    connect = require('connect'),
    http    = require('http');

// App modules
var AppController = require('./app-controller.js').AppController;

// Pathes
var ServerRoot  = __filename,
    ProjectRoot = path.normalize(ServerRoot + '/../'),
    WWWRoot     = path.normalize(ProjectRoot + '/wwwroot/');

// Configuration
var Port = 8882;

// Connect2 application
var app = connect()
    .use(connect.logger('dev'))
    .use(connect.urlencoded())
    .use(connect.multipart())
    .use(connect.query())
    .use('/app', AppController.Route(connect, model, view))
    .use(connect.favicon())
    .use(connect.static(WWWRoot))
    .use(function(err, req, res, next)
    {
        var resp = '';

        if ( err )
        {
            resp = "error";
            console.log(err);
        }
        else
        {
            resp = "OK";
        }

        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end(resp);
    });

// HTTPS server
http.createServer(app).listen(Port);

})()

