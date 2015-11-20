/*
 * grunt-css-stats-display
 * https://github.com/tictrac/grunt-css-stats-display
 *
 * Copyright (c) 2015 Tictrac
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs'),
    util = require('util'),
    handlebars = require('handlebars'),
    helpers = require('./lib/helper.js'),
    cssstats = require('css-statistics');

module.exports = function(grunt) {
    grunt.registerMultiTask('cssstatsdisplay', 'displays css statistics nicely', function() {
        var options = this.options(),
            template = handlebars.compile(grunt.file.read(__dirname + '/template/index.html')),
            templateCss = grunt.file.read(__dirname + '/template/styles.css'),
            css,
            stats,
            dest;

        /**
         * sets to the css files to be run through the stats engine
         * @param {object} files
         */
        function getCss(files) {
            var src;

            files.forEach(function(f) {
                dest = f.dest;
                src = f.src.filter(function(filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                }).map(function(filepath) {
                    return grunt.file.read(filepath);
                });
            });

            return src[0];
        }

        /**
         * set the file destination
         * @param {Object} files
         */
        function setDest(files) {
            files.forEach(function(f) {
                dest = f.dest;
            });
        }

        /**
         * sets the custom object properties for display
         * @param {Object} stats
         * @param {object} opts
         */
        function setCustomProperties(stats, opts) {
            var badSelectors = helpers.getWorstSelectors(stats.selectors, opts.specificityThreshold),
                i;

            for (i = 0; i < badSelectors.length; i++) {
                badSelectors[i].specificity = helpers.stripCommas(badSelectors[i].specificity);
            }

            stats.badSelectors = badSelectors;
            stats.fileSize = (stats.size/1000).toFixed(0);
        }

        setDest(this.files);
        css = cssstats(getCss(this.files));
        setCustomProperties(css, options);
        grunt.file.write(dest + '/index.html', template(css));
        grunt.file.write(dest + '/styles.css', templateCss);

    });

};
