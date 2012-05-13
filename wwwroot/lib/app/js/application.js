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
(function($, _, backbone, exports)
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

/**
    @class exports.Application
    @brief Application class - Web application
*/
exports.Application = function()
{
    var defaults =
    {
        lang: 'en', /* en, de, fr, lv, etc. */
    };

    return {
        ctx:
        {
            lang: null
        },
        Initialize: function()
        {
            exports.ToLog('Garage:', 'Starting Application.');

            try
            {
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
            }
            catch(e)
            {
                exports.ToLog(e, e.toString());
            }
        }
    };
};

})(jQuery, underscore, backbone, (typeof exports !== 'undefined' ? exports : this['Garage'] = {}));

