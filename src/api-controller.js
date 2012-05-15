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
    Db = require('./api-db.js'),
    ApiDb = Db.ApiDb,
    DbName = 'garage';

function IsEmptyObject(o)
{
    return Object.keys(o).length === 0;
}

exports.ApiController =
{
    Initialize: function()
    {
        console.log('ApiController.Initialize');

        ApiDb.Connect(DbName);
    },
    Terminate: function()
    {
        console.log('ApiController.Terminate');

        ApiDb.Disconnect();
    },
    CategoriesGet: function(req, res, next)
    {
        console.log('ApiController.Categories');
        
        ApiDb.Category.find({}, function(err, data){
            if ( !err )
                this.SendJson(res, data);
            else
                this.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    CategoriesCreateCategory: function(req, res, next)
    {
        console.log('ApiController.Category');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    CategoryGet: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    CategoryCreateItem: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    CategoryEdit: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    CategoryDelete: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    ItemGet: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    ItemEdit: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    ItemDelete: function(req, res, next)
    {
        console.log('ApiController.Item');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    Admin: function(req, res, next)
    {
        console.log('ApiController.Admin');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    Default: function(req, res, next)
    {
        console.log('ApiController.Default', req.method, req.url);

        this.SendError(res, 'Invalid API: ' + req.method + ' ' + req.url, 501);
    },
    SendJson: function(res, content)
    {
        res.contentType('application/json').json(content);
        return this;
    },
    SendError: function(res, content, code)
    {
        res.send(content, code);
    },
    Route: function(app)
    {
        console.log('ApiController.Route');

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
        app.get(    '/api/admin/:obj/*',     function(req, res, next){ that.Admin.call(that, req, res, next); }                     );
        // -- Other
        app.all(    '/*',                    function(req, res, next){ that.Default.call(that, req, res, next); }                   );

        return this;
    }
};

})()

