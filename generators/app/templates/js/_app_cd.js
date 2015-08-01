/**
 * Project : albawebapp
 * File : app
 * Date : 01/08/2015
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */
/*global window, document, simplyCountdown*/
(function (window) {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        var d = new Date(new Date().getTime() + 48 * 120 * 120 * 2000);

        simplyCountdown('.countdown', {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
        });
    });
}(window));
