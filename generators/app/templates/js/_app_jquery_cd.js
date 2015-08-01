/**
 * Project : albawebapp
 * File : app
 * Date : 01/08/2015
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */
/*global window, document, simplyCountdown, $, jQuery*/
(function ($) {
    'use strict';
    $('document').ready(function () {
        var d = new Date(new Date().getTime() + 48 * 120 * 120 * 2000);

        $('.countdown').simplyCountdown({
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
        });
    });
}(jQuery));
