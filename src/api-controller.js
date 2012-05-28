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
    ApplicationGet: function(req, res, next)
    {
        console.log('ApiController.ApplicationGet');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    CategoriesGet: function(req, res, next)
    {
        console.log('ApiController.CategoriesGet');

        var that = this;
        ApiDb.Category.find({}).asc('name').run(function(err, data){
            if ( !err )
                that.SendJson(res, data);
            else
                that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    CategoriesCreateCategory: function(req, res, next)
    {
        console.log('ApiController.CategoriesCreateCategory');

        var that  = this,
            name  = req.params.name,
            descr = req.params.description,
            cat   = new ApiDb.Category({name: name, description: descr, type: 'user'});

        cat.save(function(err){
            if ( !err )
                that.SendJson(res, cat);
            else
                that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    CategoryGet: function(req, res, next)
    {
        console.log('ApiController.CategoryGet');

        var that = this,
            cat  = req.params.cat;

        ApiDb.Category.findOne({_id: cat}, function(err, data){
            if ( !err )
                that.SendJson(res, data);
            else
                that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    CategoryEdit: function(req, res, next)
    {
        console.log('ApiController.CategoryEdit');

        var that  = this,
            cat   = req.params.cat,
            name  = req.params.name,
            descr = req.params.description,
            dirty = false;

        ApiDb.Category.findOne({_id: cat}, function(err, data){
            if ( !err )
            {
                name && name.length ? data.name = name, dirty = true;
                descr && descr.length ? data.description = descr, dirty = true;

                if ( dirty = true )
                {
                    data.update(function(err, data){
                        if ( !err )
                            that.SendJson(res, data);
                        else
                            that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
                    });
                }
                else
                    that.SendJson(res, data);
            }
            else
                that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    CategoryDelete: function(req, res, next)
    {
        console.log('ApiController.CategoryDelete');

        var that = this,
            cat  = req.params.cat;

        ApiDb.Category.findOne({_id: cat}, function(err, data){
            if ( !err )
                data.remove(), that.SendJson(res, data);
            else
                that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    ItemsGet: function(req, res, next)
    {
        console.log('ApiController.ItemsGet');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    ItemsCreateItem: function(req, res, next)
    {
        console.log('ApiController.ItemsCreateItem');

        var that   = this,
            name   = req.params.name,
            descr  = req.params.description,
            userid = req.params.user,
            catid  = req.params.category,
            item   = new ApiDb.Item({name: name, description: descr, user: userid, category: catid, images: []});

        item.save(function(err){
            if ( !err )
                that.SendJson(res, cat);
            else
                that.SendError(res, 'Invalid Query: ' + req.method + ' ' + req.url, 400);
        });
    },
    ItemsEdit: function(req, res, next)
    {
        console.log('ApiController.ItemsEdit');

        var response = JSON.stringify({});

        this.SendJson(res, response);
    },
    ItemsDelete: function(req, res, next)
    {
        console.log('ApiController.ItemsDelete');

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

        // -- application
        app.get(    '/api/application',     function(req, res, next){ that.ApplicationGet.call(that, req, res, next); }            );

        // -- all categories in the garage (list)
        app.get(    '/api/categories',      function(req, res, next){ that.CategoriesGet.call(that, req, res, next); }             );
        app.get(    '/api/categories/:name/:description',
                                            function(req, res, next){ that.CategoriesCreateCategory.call(that, req, res, next); }  );
        app.put(    '/api/categories',      function(req, res, next){ that.CategoriesCreateCategory.call(that, req, res, next); }  );

        // -- single category (just info on the category)
        app.get(    '/api/category/:cat',   function(req, res, next){ that.CategoryGet.call(that, req, res, next); }               );
        app.put(    '/api/category/:cat',   function(req, res, next){ that.ItemsCreateItem.call(that, req, res, next); }           );
        app.post(   '/api/category/:cat',   function(req, res, next){ that.CategoryEdit.call(that, req, res, next); }              );
        app.delete( '/api/category/:cat',   function(req, res, next){ that.CategoryDelete.call(that, req, res, next); }            );

        // -- single item in category or filter (including 'all', and fuzzy queries)
        app.get(    '/api/items/:cat/:id',  function(req, res, next){ that.ItemsGet.call(that, req, res, next); }                  );
        app.put(    '/api/items/:cat',      function(req, res, next){ that.ItemsCreateItem.call(that, req, res, next); }           );
        app.post(   '/api/items/:cat/:id',  function(req, res, next){ that.ItemsEdit.call(that, req, res, next); }                 );
        app.delete( '/api/items/:cat/:id',  function(req, res, next){ that.ItemsDelete.call(that, req, res, next); }               );

        // -- admin interface (with the same options)
        app.get(    '/api/admin/:obj/*',    function(req, res, next){ that.Admin.call(that, req, res, next); }                     );

        // -- Other
        app.all(    '/*',                   function(req, res, next){ that.Default.call(that, req, res, next); }                   );

        return this;
    }
};

})()

