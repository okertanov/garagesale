/**
    @file       api-db.js
    @brief      App models & db.

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

var mongoose = require('mongoose');

exports.Category = new mongoose.Schema({

});

exports.ApiDb =
{
    Connect: function(db)
    {
        console.log('ApiDb.Connect');

        try
        {
            if ( !db || !db.length )
                throw 'ApiModels.Connect invalid argument';
            mongoose.connect('mongodb://localhost/' + db);
        }
        catch(e)
        {
            console.log(e, e.toString());
            throw e;
        }
    },
    Disconnect: function()
    {
        console.log('ApiDb.Disconnect');

        try
        {
            mongoose.close();
        }
        catch(e)
        {
            console.log(e, e.toString());
        }
    }
};

})()

