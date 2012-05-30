/**
    @file       application.js
    @brief      Desktop Web application main module.

    @author     Oleg Kertanov <okertanov@gmail.com>
    @date       May 2012
    @copyright  Copyright (C) 2012 Oleg Kertanov <okertanov@gmail.com>
    @license    BSD
    @see LICENSE file
*/

/**
    @brief IIFE
    @see https://developer.mozilla.org/en/JavaScript/Reference/Operators/function
*/
(function($, _, Backbone, exports)
{

/**
    @brief Strict mode by default
    @see https://developer.mozilla.org/en/JavaScript/Strict_mode
*/
"use strict";

/**
    @fn $(function())
    @brief jQuery-like ready() that re-launches every <script></script> load.
    @see http://api.jquery.com/ready/
    @attention So try to avoid direct code invocation at the top of current namespace
               and here, in DOM's ready handler.
*/
$(function()
{
    try
    {
    }
    catch(e)
    {
        exports.ToLog(e, e.toString());
    }
});

/**
    @class exports.Logger
    @brief Logger class - Logs and Traces support
    @see https://developer.mozilla.org/en/DOM/console
*/
exports.ConsoleLogger = function()
{
    return {
        Assert: function()
        {
            if ( typeof(console) === 'object' )
            {
                try
                {
                    console.assert['apply'](console, Array.prototype.slice.call(arguments));
                }
                catch (e)
                {
                    if (typeof(console.assert) === 'function')
                        console.assert(Array.prototype.slice.call(arguments));
                }
            }
        },
        ToLog: function()
        {
            if ( typeof(console) === 'object' )
            {
                try
                {
                    console.log['apply'](console, Array.prototype.slice.call(arguments));
                }
                catch (e)
                {
                    if (typeof(console.log) === 'function')
                        console.log(Array.prototype.slice.call(arguments));
                }
            }
        }
    };
};

/**
    @var exports.ToLog
    @brief Singleton fn of exports.ConsoleLogger.ToLog method
*/
exports.ToLog = (new exports.ConsoleLogger()).ToLog;

/**
    @class exports.Utilities
    @brief Utilities class - misc re-usable code
*/
exports.Utilities = function()
{
    // Cached regexp for FormatString()
    var re = /\{([^}]+)\}/g;

    return {
        /**
            @fn Utilities.FormatString()
            @brief Private API: FormatString
            Pythonish string formatting:
                format('{0}', ['zzz'])
                format('{x}', {x: 1})
            @see http://davedash.com/2010/11/19/pythonic-string-formatting-in-javascript/
        */
        FormatString: function(s, args)
        {
            return s.replace(re, function(_, match){ return args[match]; });
        },
        /**
            @fn Utilities.FormatDate()
            @brief FormatDate - Date/Time formatting
        */
        FormatDate: function(date, format)
        {
            return date.toLocaleDateString();
        },
        /**
            @fn Utilities.RandomString()
            @brief RandomString - Generates random string
        */
        RandomString: function(num)
        {
            var buffer = '_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''),
                length = buffer.length,
                bound  = num || Math.floor(length / 2),
                string = '';

            for (var i = 0; i < bound; i++)
                string += buffer[ Math.floor(Math.random() * length) ];

            return string;
        }
    };
};

/**
    @var exports.Util
    @brief Singleton object of Utilities class
*/
exports.Util = new exports.Utilities();

/* APP */

/**
    @class exports.Application
    @brief Application class - Web application
*/
exports.Application = function(options)
{
    var defaults =
    {
        name: 'Garage',
        lang: 'en', /* en, de, fr, lv, etc. */
        athome: null
    };

    var ctx = $.extend({ }, defaults, options);

    return {
        ctx: ctx,
        Initialize: function()
        {
            exports.ToLog(this.ctx.name, 'Starting Application.');

            try
            {
                var that = this;

                // Router
                that.router = new exports.Router({application: this});

                // Application
                var appModel = new exports.ApplicationModel();

                var subviews =
                    [
                        new exports.HeaderView(  { model: new exports.HeaderModel()  } ),
                        new exports.ContentView( { model: new exports.ContentModel() } ),
                        new exports.FooterView(  { model: new exports.FooterModel()  } )
                    ];
                var appView = new exports.ApplicationView({model: appModel, subviews: subviews});

                // ApplicationView.render() is called when model is changed;
                appModel.fetch({
                    error:   function(model, response){
                        exports.ToLog('Error: ', response.statusText);
                        that.router.NavigateToExternal('/500.html');
                    },
                    success: function(model, response){
                        // Start routing
                        Backbone.history.start();

                        // Categories
                        var categories = new exports.CategoriesCollection(),
                            categoriesView = new exports.CategoriesView( {collection: categories, el: '#ui-content-categories'} );
                        categories.fetch({
                            error: function(model, response){
                                exports.ToLog('categories.fetch: Error:', response.statusText);
                            },
                            success: function(model, response){
                                exports.ToLog('categories.fetch: OK');

                                // Hot/promoted items
                                var hotItems = new exports.ItemsCollection([], {filter: 'hot'}),
                                    hotItemsView = new exports.ItemsView( {collection: hotItems, el: '#ui-content-hot-items'} );
                                hotItems.fetch({
                                    error: function(model, response){
                                        exports.ToLog('hotItems.fetch: Error:', response.statusText);
                                    },
                                    success: function(model, response){
                                        exports.ToLog('hotItems.fetch: OK');
                                    }
                                });

                                // Recent items
                                var newItems = new exports.ItemsCollection([], {filter: 'new'}),
                                    newItemsView = new exports.ItemsView( {collection: newItems, el: '#ui-content-new-items'} );
                                newItems.fetch({
                                    error: function(model, response){
                                        exports.ToLog('newItems.fetch: Error:', response.statusText);
                                    },
                                    success: function(model, response){
                                        exports.ToLog('newItems.fetch: OK');
                                    }
                                });
                            }
                        });
                    }
                });
            }
            catch(e)
            {
                exports.ToLog(e, e.toString());
            }

            return this;
        },
        Terminate: function()
        {
            try
            {
                exports.ToLog(this.ctx.name, 'Stopping Application.');
            }
            catch(e)
            {
                exports.ToLog(e, e.toString());
            }
        },
        ShowHome: function(show)
        {
            if ( show )
            {
                $('#ui-home-content').show('fast');
            }
            else
            {
                $('#ui-home-content').hide('fast');
            }
        },
        ShowCategory: function(cat, show)
        {
            if ( show )
            {
                var catItems = new exports.ItemsCollection([], {filter: cat}),
                    catItemsView = new exports.ItemsView( {collection: catItems, el: '#ui-category-items-content'} );
                catItems.fetch({
                    error: function(model, response){
                        exports.ToLog('catItems.fetch: Error:', response.statusText);
                    },
                    success: function(model, response){
                        exports.ToLog('catItems.fetch: OK');
                    }
                });

                $('#ui-category-items-content').show('fast');
            }
            else
            {
                $('#ui-category-items-content').hide('fast');
            }
        },
        ShowItem: function(cat, item, show)
        {
            if ( show )
            {
                var catItem = new exports.ItemModel({category: cat, _id: item}),
                    catItemView = new exports.ItemView( {model: catItem} );
                catItem.fetch({
                    error: function(model, response){
                        exports.ToLog('catItem.fetch: Error:', response.statusText);
                    },
                    success: function(model, response){
                        exports.ToLog('catItem.fetch: OK');
                        $('#ui-category-items-content').html( $('<ul class="ui-items-view pline"></ul>').append( catItemView.$el )  );
                    }
                });

                $('#ui-category-items-content').show('fast');
            }
            else
            {
                $('#ui-category-items-content').hide('fast');
            }
        }
    };
};

/* Router */
exports.Router = Backbone.Router.extend(
{
    routes:
    {
        ''                  :   'Index',
        'access/home'       :   'Home',
        'access/post'       :   'Post',
        'category/:cat'     :   'Category',
        'items/:cat/:item'  :   'Item'
    },
    initialize: function(options)
    {
        exports.ToLog('Router', 'initialize');

        if ( options.application )
            this.application = options.application;
    },
    Index: function()
    {
        exports.ToLog('Router', 'Index');
        this.NavigateTo('access/home');
    },
    Home: function()
    {
        exports.ToLog('Router', 'Home');
        this.application.ShowItem(null, null, false);
        this.application.ShowCategory(null, false);
        this.application.ShowHome(true);
    },
    Post: function()
    {
        $('<div class="modal fade" id="ui-post-modal">'  +
          '<div class="modal-header">' +
              '<span><strong>Place item</strong></span>' +
          '</div>' +
          '<div class="modal-body">' +
            '<form class="form-horizontal">' +
                '<fieldset>' +
                  '<div class="control-group">' +
                    '<label class="control-label" for="focusedInput">Subject</label>' +
                    '<div class="controls">' +
                      '<input class="input-xlarge focused" id="ui-new-post-subject" type="text" value="">' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-actions">' +
                    '<button type="submit" class="btn btn-primary">Save changes</button>' +
                    '<button class="btn">Cancel</button>' +
                  '</div>' +
                '</fieldset>' +
              '</form>' +
          '</div>' +
          '<div class="modal-footer">' +
              '<a href="#" class="btn btn-primary" data-dismiss="modal">Post</a>' +
              '<a href="#" class="btn" data-dismiss="modal">Close</a>' +
          '</div>' +
          '</div>').modal('show');

        this.NavigateTo('access/home');
    },
    Category: function(cat)
    {
        exports.ToLog('Router', 'Category', cat);
        this.application.ShowItem(null, null, false);
        this.application.ShowHome(false);
        this.application.ShowCategory(cat, true);
    },
    Item: function(cat, item)
    {
        exports.ToLog('Router', 'Item');
        this.application.ShowCategory(null, false);
        this.application.ShowHome(false);
        this.application.ShowItem(cat, item, true);
    },
    NavigateTo: function(uri)
    {
        this.navigate(uri, {trigger: true});
    },
    NavigateToExternal: function(uri)
    {
        window.location.href = uri;
    }
});

/* Models */

exports.ApplicationModel = Backbone.Model.extend(
{
    defaults:
    {
    },
    url: function()
    {
        return '/api/application';
    },
    initialize: function()
    {
    },
    validate: function(attributes)
    {
    }
});

exports.ContentModel = Backbone.Model.extend(
{
    defaults:
    {
    },
    url: function()
    {
        return null;
    },
    initialize: function()
    {
    },
    validate: function(attributes)
    {
    }
});

exports.HeaderModel = Backbone.Model.extend(
{
    defaults:
    {
    },
    url: function()
    {
        return null;
    },
    initialize: function()
    {
    },
    validate: function(attributes)
    {
    }
});

exports.FooterModel = Backbone.Model.extend(
{
    defaults:
    {
        copyyear: (new Date()).getFullYear().toString(),
        author:
        {
            name: 'Oleg Kertanov',
            email: 'okertanov@gmail.com'
        }
    },
    url: function()
    {
        return null;
    },
    initialize: function()
    {
    },
    validate: function(attributes)
    {
    }
});

exports.CategoryModel = Backbone.Model.extend(
{
    defaults:
    {
    },
    url: function()
    {
        return '/api/category/' + this.id;
    },
    initialize: function()
    {
        this.id = this.get('_id');
    },
    validate: function(attributes)
    {
    }
});

exports.CategoriesCollection = Backbone.Collection.extend(
{
    model: exports.CategoryModel,
    url: function()
    {
        return '/api/categories';
    },
    initialize: function()
    {
    },
    validate: function(attributes)
    {
    }
});

exports.ItemModel = Backbone.Model.extend(
{
    defaults:
    {
    },
    url: function()
    {
        return '/api/items/' + this.catid + '/' + this.id;
    },
    initialize: function()
    {
        this.id = this.get('_id');
        this.catid = this.get('category');
    },
    validate: function(attributes)
    {
    }
});

exports.ItemsCollection = Backbone.Collection.extend(
{
    model: exports.ItemModel,
    url: function()
    {
        return ('/api/items' + (this.filter ? ('/' + this.filter) : ('')));
    },
    initialize: function(models, options, parameters)
    {
        this.filter = options.filter;
    },
    validate: function(attributes)
    {
    }
});

/* Views */

exports.ApplicationView = Backbone.View.extend(
{
    el: 'body > section',
    tmpl: 'unused #app-view-template',
    initialize: function()
    {
        exports.ToLog('ApplicationView', 'initialize');

        this.model.view = this;
        this.model.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('ApplicationView', 'render');

        this.options.subviews.map(function(view){
            view.render();
        });

        return this;
    }
});

exports.ContentView = Backbone.View.extend(
{
    el: 'body > section > section > article',
    tmpl: '#content-view-template',
    initialize: function()
    {
        exports.ToLog('ContentView', 'initialize');

        this.model.view = this;
        this.model.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('ContentView', 'render');

        var template = _.template($(this.tmpl).html());
        $(this.el).html(template(this.model.toJSON()));

        return this;
    }
});

exports.HeaderView = Backbone.View.extend(
{
    el: 'body > section > section > header',
    tmpl: '#header-view-template',
    initialize: function()
    {
        exports.ToLog('HeaderView', 'initialize');

        this.model.view = this;
        this.model.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('HeaderView', 'render');

        var template = _.template($(this.tmpl).html());
        $(this.el).html(template(this.model.toJSON()));

        return this;
    }
});

exports.FooterView = Backbone.View.extend(
{
    el: 'body > section > section > footer',
    tmpl: '#footer-view-template',
    initialize: function()
    {
        exports.ToLog('FooterView', 'initialize');

        this.model.view = this;
        this.model.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('FooterView', 'render');

        var template = _.template($(this.tmpl).html());
        $(this.el).html(template(this.model.toJSON()));

        return this;
    }
});

exports.CategoryView = Backbone.View.extend(
{
    tagName: 'li',
    className: 'ui-category-bage',
    initialize: function()
    {
        exports.ToLog('CategoryView', 'initialize');

        this.model.view = this;
        this.model.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('CategoryView', 'render');

        $('<a href="#">').appendTo( this.$el )
            .text( this.model.get('name') )
            .attr('title', this.model.get('description') )
            .attr( 'href', '#category/' + this.model.id );

        return this;
    }
});

exports.CategoriesView = Backbone.View.extend(
{
    tmpl: '#categories-view-template',
    initialize: function()
    {
        exports.ToLog('CategoriesView', 'initialize');

        this.collection.view = this;
        this.collection.bind('reset',  this.render, this);
        this.collection.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('CategoriesView', 'render');

        var that = this,
            template = _.template($(this.tmpl).html());

        $(this.el).html(template());

        var ul = $(this.el).children('ul');

        this.collection.each(function(item){
            var view = new exports.CategoryView({model: item});
            view.render().$el.appendTo( ul );
        });

        return this;
    }
});

exports.ItemView = Backbone.View.extend(
{
    tagName: 'li',
    className: 'ui-item-line',
    initialize: function()
    {
        exports.ToLog('ItemView', 'initialize');

        this.model.view = this;
        this.model.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('ItemView', 'render');

        $('<a href="#">').appendTo( this.$el )
            .text( this.model.get('name') )
            .attr('title', this.model.get('description') )
            .attr( 'href', '#items/' + this.model.catid + '/' + this.model.id );
        $('<p>').appendTo( this.$el )
            .text( this.model.get('description') );

        return this;
    }
});

exports.ItemsView = Backbone.View.extend(
{
    tmpl: '#items-view-template',
    initialize: function()
    {
        exports.ToLog('ItemsView', 'initialize');

        this.collection.view = this;
        this.collection.bind('reset',  this.render, this);
        this.collection.bind('change', this.render, this);

        return this;
    },
    render: function()
    {
        exports.ToLog('ItemsView', 'render');

        var that = this,
            template = _.template($(this.tmpl).html());

        $(this.el).html(template());

        var ul = $(this.el).children('ul');

        this.collection.each(function(item){
            var view = new exports.ItemView({model: item});
            view.render().$el.appendTo( ul );
        });

        return this;
    }
});

})(jQuery, _, Backbone, (typeof exports !== 'undefined' ? exports : this['Garage'] = {}));

