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

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

exports.UserSchema = new Schema({
    name:           { type: String,   required: true  },
    fullname:       { type: String,   required: false },
    info:           { type: String,   required: false },
    isadmin:        { type: Boolean,  required: true  },
});

exports.CategorySchema = new Schema({
    name:           { type: String,   required: true  },
    description:    { type: String,   required: false },
    type:           { type: String,   required: true,
                        enum: ['system', 'user', 'special']
                    }
});

exports.ItemSchema = new Schema({
    name:           { type: String,     required: true  },
    description:    { type: String,     required: false },
    date:           { type: Date,       required: true,
                        default: Date.now               },
    images:         { type: [String],   required: false },
    user:           { type: ObjectId,   required: true  },
    category:       { type: ObjectId,   required: true  },
    ishot:          { type: Boolean,    required: false },
});

exports.ApiDb =
{
    User: mongoose.model('UserModel', exports.UserSchema),
    Item: mongoose.model('ItemModel', exports.ItemSchema),
    Category: mongoose.model('CategoryModel', exports.CategorySchema),
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
            mongoose.connection.close();
        }
        catch(e)
        {
            console.log(e, e.toString());
        }
    }
};

})()

