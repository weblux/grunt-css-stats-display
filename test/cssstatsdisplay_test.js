'use strict';

var grunt = require('grunt'),
    cssStats = require('css-statistics'),
    helpers = require('../tasks/lib/helper.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.css_stats_display = {
    setUp: function(done) {
        this.testCss = grunt.file.read('test/fixtures/test.css');
        this.cssJson = cssStats(this.testCss);
        done();
    },
    default_options: function(test) {
        var html = grunt.file.isFile('tmp/output_default/index.html'),
            css = grunt.file.isFile('tmp/output_default/styles.css');

        test.expect(5);

        /** EXPECT ALL FILES TO EXIST **/
        test.equal(html, true, 'html file should exist');
        test.equal(css, true, 'css file should exist');

        /** MAKE SURE THE HELPERS RUN CORRECTLY  **/
        test.equal(helpers.getWorstSelectors(this.cssJson.selectors, '0100').length, 3, 'should return 3 selectors');
        test.equal(helpers.getWorstSelectors(this.cssJson.selectors, '0200').length, 1, 'should return 1 selectors');
        test.equal(helpers.stripCommas('this, is, a lot, of, commas'), 'this is a lot of commas', 'should return a string with no commas');

        test.done();
    },
    custom_options: function(test) {
        var html = grunt.file.isFile('tmp/output_custom/index.html'),
            css = grunt.file.isFile('tmp/output_custom/styles.css');

        test.expect(2);

        /** EXPECT ALL FILES TO EXIST */
        test.equal(html, true, 'html file should exist');
        test.equal(css, true, 'css file should exist');

        test.done();

    }
};
