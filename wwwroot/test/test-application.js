/**
    @file       test-application.js
    @brief      Web application tests.

    @author     Oleg Kertanov <okertanov@gmail.com>
    @date       May 2012
    @copyright  Copyright (C) 2012 Oleg Kertanov <okertanov@gmail.com>
    @license    BSD
    @see LICENSE file
*/

"use strict";

module('application.js');

test('Application Bootstrapping', function ()
{
    expect(3);

    ok( true, 'Self-test' );

    equal( typeof window.Garage, 'object', 'window.Garage exists' );
    equal( typeof Garage, 'object', 'Garage exists' );
});

