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

var underscore = require('underscore')._,
    Db = require('api-db.js ').ApiDb;

function IsEmptyObject(o)
{
    return Object.keys(o).length === 0;
}

exports.ApiController =
{
    Initialize: function()
    {
        Db.Connect();
    },
    Terminate: function()
    {
        Db.Disconnect();
    },
    CategoriesGet: function(req, res, next)
    {
        console.log('ApiController.Categories');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    CategoriesCreateCategory: function(req, res, next)
    {
        console.log('ApiController.Category');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    CategoryGet: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    CategoryCreateItem: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    CategoryEdit: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    CategoryDelete: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    ItemGet: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    ItemEdit: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    ItemDelete: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    Admin: function(req, res, next)
    {
        console.log('ApiController.Admin');

        var response = JSON.stringify({});

        this.SendJson(response);
    },
    SendJson: function(res, content)
    {
        res.contentType('application/json').json(content);
        return this;
    }
    Route: function(app)
    {
        var that = this;

        // -- all categories in the garage (list)
        app.get(    '/api/categories',       function(req, res, next){ that.CategoriesGet.call(that, req, res, next); }             );
        app.put(    '/api/categories',       function(req, res, next){ that.CategoriesCreateCategory.call(that, req, res, next); }  );
        // -- single category (just info on the category)
        app.get(    '/api/category/:cat',    function(req, res, next){ that.CategoryGet.call(that, req, res, next); }               );
        app.put(    '/api/category/:cat',    function(req, res, next){ that.CategoryCreateItem.call(that, req, res, next); }        );
        app.post(   '/api/category/:cat',    function(req, res, next){ that.CategoryEdit.call(that, req, res, next); }              );
        app.delete( '/api/category/:cat',    function(req, res, next){ that.CategoryDelete.call(that, req, res, next); }            );
        // -- single item in category or filter (including 'all', and fuzzy queries)
        app.get(    '/api/item/:cat/:id',    function(req, res, next){ that.ItemGet.call(that, req, res, next); }                   );
        app.post(   '/api/item/:cat/:id',    function(req, res, next){ that.ItemEdit.call(that, req, res, next); }                  );
        app.delete( '/api/item/:cat/:id',    function(req, res, next){ that.ItemDelete.call(that, req, res, next); }                );
        // -- admin interface (with the same options)
        app.get(    '/api/admin/:obj:/*',    function(req, res, next){ that.Admin.call(that, req, res, next); }                     );

        return this;
    }
};

})()

