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

var mongoose = require('mongoose'),
    underscore = require('underscore')._;

function IsEmptyObject(o)
{
    return Object.keys(o).length === 0;
}

exports.ApiController =
{
    Categories: function(req, res, next)
    {
        console.log('ApiController.Categories');

        res.contentType('application/json');

        res.json(req);
    },
    Category: function(req, res, next)
    {
        console.log('ApiController.Category');

        res.contentType('application/json');

        res.json(req);
    },
    Item: function(req, res, next)
    {
        console.log('ApiController.Item');

        res.contentType('application/json');

        res.json(req);
    },
    Admin: function(req, res, next)
    {
        console.log('ApiController.Admin');

        res.contentType('application/json');

        res.json(req);
    },
    Route: function(app)
    {
        // -- all categories in the garage (list)
        app.all('/api/garage',                  this.Categories);
        // -- single category (just info on the category)
        app.all('/api/garage/:cat',             this.Category);
        // -- items in category by filter (including 'all', and fuzzy queries)
        app.all('/api/garage/:cat/filter/:f',   this.Items);
        // -- single item in category
        app.all('/api/garage/:cat/:id',         this.Item);
        // -- admin interface (with the same options)
        app.all('/api/admin',                   this.Admin);

        return this;
    }
};

})()

