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
    };

    var ctx = $.extend({ }, defaults, options);

    return {
        ctx: ctx,
        Initialize: function()
        {
            exports.ToLog(this.ctx.name, 'Starting Application.');

            try
            {
                var appModel = new exports.ApplicationModel();

                var subviews =
                    [
                        new exports.HeaderView(  { model: new exports.HeaderModel()  } ),
                        new exports.ContentView( { model: new exports.ContentModel() } ),
                        new exports.FooterView(  { model: new exports.FooterModel()  } )
                    ];
                var appView = new exports.ApplicationView({model: appModel, subviews: subviews});

                appModel.fetch({
                    error:   function(model, response){
                        exports.ToLog(response);
                    },
                    success: function(model, response){
                        var categories = new exports.CategoriesCollection();
                        var categoriesView = new exports.CategoriesView( {collection: categories, el: '#ui-content-categories'} );
                        categories.fetch();
                    }
                }); // ApplicationView.render() is called when model is changed;
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
        }
    };
};

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
    initialize: function()
    {
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

        this.$el.text(this.model.name);

        return this;
    }
});

exports.CategoriesView = Backbone.View.extend(
{
    tagName: 'ul',
    className: 'ui-categories-view',
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

        this.$el.empty();

        var that = this;
        this.collection.each(function(item){
            var view = new exports.CategoryView({model: item});
            $('<' + that.tagName + '>').appendTo(that.$el).append( view.render().$el );
        });

        return this;
    }
});

})(jQuery, _, Backbone, (typeof exports !== 'undefined' ? exports : this['Garage'] = {}));

