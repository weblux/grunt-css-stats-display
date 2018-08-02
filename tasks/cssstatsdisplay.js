/*
 * grunt-css-stats-display
 * https://github.com/Tictrac/grunt-css-stats-display
 *
 * Copyright (c) 2015 Tictrac
 * Licensed under the MIT license.
 */

'use strict'
var handlebars = require('handlebars')
var helpers = require('./lib/helper.js')
var cssStats = require('cssstats')

module.exports = function (grunt) {
  grunt.registerMultiTask('cssstatsdisplay', 'displays css statistics nicely', function () {
    var options = this.options()
    var templateIndexHtml = setTemplate('index', options)
    var templateStatsHtml = setTemplate('stats', options)
    var templateCss = setTemplateCss(options)
    var dest = getDest(this.files)

    var files = this.files.map(function (file) {
      // Concat specified files.
      file.content = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.')
          return false
        } else {
          return true
        }
      }).map(function (filepath) {
        // Get the CSS content
        return grunt.file.read(filepath, { encoding: 'utf8' })
      })[0]

      file.stats = cssStats(file.content)
      setCustomProperties(file.stats, options)

      // Set the file name
      var filename = file.dest.split('/')
      filename = filename[filename.length - 1]
      file.name = filename[0].toUpperCase() + filename.slice(1)

      // Set the file destination
      file.dest = file.dest.replace('.css', '.html')

      return file
    })

    function getIndexContent () {
      var fileSize = 0
      var selectors = 0
      var declarations = 0
      var fontSizes = []
      var backgroundColors = []
      var textColors = []
      var mediaQueries = []
      var specificityMax = 0
      var specificityAvg = []
      var fileDatas = []
      var top10BadSelectors = []

      files.forEach(function (file) {
        var background = file.stats.backgroundColors.plain
        var path = file.dest.split('/')
        fileSize += parseInt(file.stats.fileSize, 10)
        selectors += file.stats.selectors.total
        declarations += file.stats.declarations.total
        fontSizes = getUnique(fontSizes, file.stats.declarations.properties['font-size'])
        backgroundColors = getUnique(backgroundColors, background.concat(file.stats.backgroundColors.gradient))
        textColors = getUnique(textColors, file.stats.textColors.items)
        mediaQueries = getUnique(mediaQueries, file.stats.uniqueMediaQueries)
        specificityMax = Math.max(specificityMax, file.stats.selectors.specificity.max)
        specificityAvg = specificityAvg.concat(file.stats.selectors.getSpecificityGraph())
        fileDatas.push({
          path: './' + path[path.length - 1],
          name: file.name
        })
        top10BadSelectors = top10BadSelectors.concat(file.stats.badSelectors.items)
      })

      function getUnique (results = [], datas = []) {
        datas.forEach(function (data) {
          if (results.indexOf(data) === -1) {
            results.push(data)
          }
        })
        return results
      }

      function getTop10badSelectors (items = []) {
        var results = []
        // Remove duplicate
        items.forEach(function (itemToFilter) {
          var exist = false
          results.forEach(function (item) {
            if (itemToFilter.selector === item.selector) {
              exist = true
            }
          })
          if (!exist) {
            results.push(itemToFilter)
          }
        })
        // Sort by highest specificity
        results.sort(function (a, b) {
          return b.specificity - a.specificity
        })
        // Keep only the 10 first element
        results.splice(10, items.length - 10)
        return results
      }

      function getAvgSpecificity () {
        var sum = 0
        specificityAvg.forEach(function (item) {
          sum += parseInt(item, 10)
        })
        return (sum / specificityAvg.length).toFixed(4)
      }

      return {
        files: fileDatas,
        stats: {
          fileSize: fileSize,
          selectors: selectors,
          declarations: declarations,
          fontSizes: fontSizes.length,
          backgroundColors: backgroundColors.length,
          textColors: textColors.length,
          mediaQueries: mediaQueries.length,
          specificityMax: specificityMax,
          specificityAvg: getAvgSpecificity(),
          badSelectors: getTop10badSelectors(top10BadSelectors)
        }
      }
    }

    /**
     * set the style file destination
     * @param {Object} files
     */
    function getDest (files) {
      var dest = ''
      files.forEach(function (file) {
        var path = file.dest.split('/')
        path.splice(-1, 1)
        dest = path.join('/')
      })

      return dest
    }

    /**
     * sets the custom object properties for display
     * @param {Object} stats
     * @param {object} opts
     */
    function setCustomProperties (stats, opts) {
      stats.selectors.specificity.average = stats.selectors.specificity.average.toFixed(4)
      var badSelectors = helpers.getWorstSelectors(stats.selectors.getSortedSpecificity(), opts.specificityThreshold)
      var background = helpers.getBackgroundColors(stats.declarations.properties['background-color'], stats.declarations.properties.background)
      var zIndex = helpers.getUniqueZIndex(stats.declarations.properties['z-index'])

      stats.fontSizes = stats.declarations.getUniquePropertyCount('font-size')
      stats.backgroundColors = {
        count: background.plain.length + background.gradient.length,
        plain: background.plain,
        gradient: background.gradient
      }

      stats.textColors = {
        count: stats.declarations.getUniquePropertyCount('color'),
        items: helpers.getTextColors(stats.declarations.properties.color)
      }
      stats.uniqueMediaQueries = helpers.getUniqueMediaQueries(stats.mediaQueries.contents)
      stats.badSelectors = {
        count: badSelectors.length,
        items: badSelectors
      }
      stats.zIndex = {
        count: zIndex.length,
        items: zIndex
      }
      stats.fileSize = (stats.size / 1000).toFixed(0)
    }

    /**
         * set and compile the template
         * @param  {Object} opts
         */
    function setTemplate (type, opts) {
      if (opts.templateHtml) {
        return handlebars.compile(grunt.file.read(opts.templateHtml))
      }
      return handlebars.compile(grunt.file.read(__dirname + '/template/' + type + '.html'))
    }

    /**
     * set the css file for the template
     * @param  {Object} opts
     */
    function setTemplateCss (opts) {
      if (opts.templateCss) {
        return grunt.file.read(opts.templateCss)
      }
      return grunt.file.read(__dirname + '/template/styles.css')
    }

    grunt.file.write(dest + '/styles.css', templateCss)
    grunt.log.writeln('File "' + dest + '/styles.css" created.')
    files.forEach(function (file, index) {
      grunt.file.write(file.dest, templateStatsHtml(file))
      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.')
    })
    grunt.file.write(dest + '/index.html', templateIndexHtml(getIndexContent()))
    grunt.log.writeln('File "' + dest + '/index.html" created.')
  })
}
