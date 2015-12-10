/*
 * grunt-css-stats-display
 * https://github.com/Tictrac/grunt-css-stats-display
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
            templateHtml = setTemplate(options),
            templateCss = setTemplateCss(options),
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
            if (!src[0]){
                grunt.log.warn('No css file specified');
                return false;
            }
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

        /**
         * set and compile the template
         * @param  {Object} opts
         */
        function setTemplate(opts) {
            if (opts.templateHtml) {
                return handlebars.compile(grunt.file.read(opts.templateHtml));
            }
            return handlebars.compile(grunt.file.read(__dirname + '/template/index.html'));
        }

        /**
         * set the css file for the template
         * @param  {Object} opts
         */
        function setTemplateCss(opts) {
            if (opts.templateCss) {
                return grunt.file.read(opts.templateCss);
            }
            return grunt.file.read(__dirname + '/template/styles.css');
        }

        setDest(this.files);
        css = cssstats(getCss(this.files));
        setCustomProperties(css, options);
        grunt.file.write(dest + '/index.html', templateHtml(css));
        grunt.file.write(dest + '/styles.css', templateCss);

    });

};
