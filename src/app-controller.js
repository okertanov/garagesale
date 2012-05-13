/**
    @file       app-controller.js
    @brief      Application controller and router.

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

var underscore = require('underscore')._;

function IsEmptyObject(o)
{
    return Object.keys(o).length === 0;
}

exports.AppController =
{
    Route: function(connect, model, view)
    {
        return connect()
            .use(connect.logger('dev'))
            .use(connect.query())
            .use(function(req, res, next)
            {
                switch(req.method)
                {
                    case 'GET':
                        var resp = req.method;
                        res.writeHead(200, {'Content-Type':'text/plain'});
                        res.end(resp);
                        console.log(req.method, req.body);
                    break;
                    case 'PUT':
                        console.log(req.method, req.body);
                    break;
                    case 'POST':
                        console.log(req.method, req.body);
                    break;
                    case 'DELETE':
                        console.log(req.method, req.body);
                    break;
                    default:
                    break;
                }
            });
    }

};

})()

