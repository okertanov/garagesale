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

                var subviews = [];
                var appView = new exports.ApplicationView({subviews: subviews});

                appModel.fetch(); // render() is called when changed;
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

var ApplicationModel = Backbone.Model.extend(
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
        this.bind('change', function(model, value)
        {
            exports.ToLog('Model changed: ' + model + ' to: ' + value);
        });
        this.bind('error', function(model, error)
        {
            exports.ToLog('Model error: ' + model + ' error: ' + error);
        });
        exports.ToLog('Model created: ' + this);
    },
    validate: function(attributes)
    {
    }
});

/* Views */

exports.ApplicationView = Backbone.View.extend({
    el: 'body',
    tmpl: 'app-view-template',
    initialize: function()
    {
        exports.ToLog('ApplicationView', 'initialize');

        this.model.bind('change', this.render, this);
        this.model.view = this;

        return this.render();
    },
    render: function()
    {
        exports.ToLog('ApplicationView', 'render');

        var template = _.template($(this.tmpl).html());
        $(this.el).html(template(this.model.toJSON()));

        this.subviews.map(function(view){
            view.render();
        });

        return this;
    }
});

})(jQuery, _, Backbone, (typeof exports !== 'undefined' ? exports : this['Garage'] = {}));

