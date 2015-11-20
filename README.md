# grunt-css-stats-display

> displays css statistics nicely

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-css-stats-display --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-css-stats-display');
```

## The "css_stats_display" task

### Overview
In your project's Gruntfile, add a section named `css_stats_display` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  css_stats_display: {
    options: {
      specificityThreshold: "0040"
    },
    files: {
      output-directory: [inputCssFile]
    }
  },
});
```

### Options

#### options.specificityThreshold
Type: `String`
Default value: `'0040'`

A string value that is used to flag selectors that are above the threshold.
This article explains the specificity numbers https://css-tricks.com/specifics-on-css-specificity/

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  css_stats_display: {
    options: {},
    files: {
      'dest/default_options': ['src/styles.css'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  css_stats_display: {
    options: {
      specificityThreshold: '0500'
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
